import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { useContainer } from "class-validator";
import { AppModule } from "src/app.module";
import { PrismaService } from "src/prisma/prisma.service";
import * as request from "supertest";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // レスポンスの型をランタイムでチェックする
  const articleShape = expect.objectContaining({
    id: expect.any(Number),
    title: expect.any(String),
    description: expect.any(String),
    body: expect.any(String),
    published: expect.any(Boolean),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });

  const articlesData = [
    {
      id: 100001,
      title: "title1",
      description: "description1",
      body: "body1",
      published: true,
    },
    {
      id: 100002,
      title: "title2",
      description: "description2",
      body: "body2",
      published: false,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    await prisma.article.create({
      data: articlesData[0],
    });
    await prisma.article.create({
      data: articlesData[1],
    });
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });

  describe("GET /articles", () => {
    it("returns a list of published articles", async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        "/articles"
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([articleShape]));
      expect(body).toHaveLength(1);
      expect(body[0].id).toEqual(articlesData[0].id);
      expect(body[0].published).toBeTruthy();
    });

    it("returns a list of draft articles", async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        "/articles/drafts"
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([articleShape]));
      expect(body).toHaveLength(1);
      expect(body[0].id).toEqual(articlesData[1].id);
      expect(body[0].published).toBeFalsy();
    });
  });

  describe("GET /articles/{id}", () => {
    it("returns an article with a valid id", async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/articles/${articlesData[0].id}`
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(articleShape);
      expect(body.id).toEqual(articlesData[0].id);
      expect(body.published).toBeTruthy();
    });

    it("returns HTTP 404 error when trying to fetch an article that not exist", async () => {
      const { status } = await request(app.getHttpServer()).get(
        "/articles/999999"
      );

      expect(status).toBe(404);
    });

    it("returns HTTP 400 error when providing id of incorrect data type", async () => {
      const { status } = await request(app.getHttpServer()).get(
        "/articles/aaaaa"
      );

      expect(status).toBe(400);
    });
  });

  describe("POST /articles", () => {
    it("creates and returns an article with valid input", async () => {
      const input = {
        title: "title3",
        description: "description3",
        body: "body3",
        published: false,
      };
      const { status, body } = await request(app.getHttpServer())
        .post("/articles")
        .send(input);

      expect(status).toBe(201);
      expect(body).toStrictEqual(articleShape);
      expect(body.title).toBe(input.title);
      expect(body.published).toBeFalsy();
    });

    it("returns HTTP 400 error when providing invalid data (no title ).", async () => {
      const invalidInput = {
        description: "description4",
        body: "body4",
        published: false,
      };
      const { status, body } = await request(app.getHttpServer())
        .post("/articles")
        .send(invalidInput);

      expect(status).toBe(400);
    });
  });
});
