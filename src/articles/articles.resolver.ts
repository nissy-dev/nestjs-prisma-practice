import { NotFoundException } from "@nestjs/common";
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { UsersService } from "src/users/users.service";
import { ArticlesService } from "./articles.service";
import { CreateArticleInput } from "./dto/create-article.input";
import { UpdateArticleInput } from "./dto/update-article.input";
import { Article } from "./entities/article.entity";

@Resolver(() => Article)
export class ArticlesResolver {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly userService: UsersService
  ) {}

  @Mutation(() => Article)
  async createArticle(
    @Args("createArticleInput") createArticleInput: CreateArticleInput
  ) {
    return this.articlesService.create(createArticleInput);
  }

  @Query(() => [Article], { name: "draftArticles" })
  async findDrafts() {
    return this.articlesService.findDrafts();
  }

  @Query(() => [Article], { name: "articles" })
  async findAll() {
    return this.articlesService.findAll();
  }

  @Query(() => Article, { name: "article" })
  async findOne(@Args("id", { type: () => Int }) id: number) {
    const article = await this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article with ${id} does not exist.`);
    }
    return article;
  }

  @Mutation(() => Article)
  async updateArticle(
    @Args("updateArticleInput") updateArticleInput: UpdateArticleInput
  ) {
    return this.articlesService.update(
      updateArticleInput.id,
      updateArticleInput
    );
  }

  @Mutation(() => Article)
  async removeArticle(@Args("id", { type: () => Int }) id: number) {
    return this.articlesService.remove(id);
  }

  @ResolveField()
  async author(@Parent() article: Article) {
    const { authorId } = article;
    return this.userService.findOne(authorId);
  }
}
