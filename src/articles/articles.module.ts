import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { ArticlesResolver } from "./articles.resolver";
import { ArticlesService } from "./articles.service";

@Module({
  providers: [ArticlesResolver, ArticlesService],
  imports: [PrismaModule, UsersModule],
})
export class ArticlesModule {}
