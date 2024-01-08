import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaClientExceptionFilter } from "./prisma-client-exception/prisma-client-exception.filter";

async function bootstrap() {
  // trace を有効化する
  await import("./tracer");

  const app = await NestFactory.create(AppModule);

  // whitelist: true で余計なパラメータを弾く
  // 余分なパラメータは無視されるだけで、エラーにはならない
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(3000);
}

bootstrap();
