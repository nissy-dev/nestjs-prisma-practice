import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Article as IArticle } from "@prisma/client";
import { User } from "src/users/entities/user.entity";

@ObjectType()
export class Article implements IArticle {
  @Field((type) => Int)
  id: number;

  @Field((type) => String)
  title: string;

  @Field((type) => String, { nullable: true })
  description: string | null;

  @Field((type) => String)
  body: string;

  @Field((type) => Boolean)
  published: boolean;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Date)
  updatedAt: Date;

  @Field((type) => Int, { nullable: true })
  authorId: number | null;

  @Field((type) => User, { nullable: true })
  author?: User;
}
