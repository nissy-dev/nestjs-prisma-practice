import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateArticleInput } from "./dto/create-article.input";
import { UpdateArticleInput } from "./dto/update-article.input";

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  create(createArticleInput: CreateArticleInput) {
    return this.prisma.article.create({ data: createArticleInput });
  }

  findAll() {
    return this.prisma.article.findMany({
      where: { published: true },
    });
  }

  findOne(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  update(id: number, UpdateArticleInput: UpdateArticleInput) {
    return this.prisma.article.update({
      where: { id },
      data: UpdateArticleInput,
    });
  }

  remove(id: number) {
    return this.prisma.article.delete({
      where: { id },
    });
  }

  findDrafts() {
    return this.prisma.article.findMany({
      where: { published: false },
    });
  }
}
