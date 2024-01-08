import { Field, HideField, Int, ObjectType } from "@nestjs/graphql";
import { User as IUser } from "@prisma/client";
import { Exclude } from "class-transformer";

@ObjectType()
export class User implements IUser {
  @Field((type) => Int)
  id: number;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Date)
  updatedAt: Date;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  email: string;

  @HideField()
  @Exclude()
  password: string;
}
