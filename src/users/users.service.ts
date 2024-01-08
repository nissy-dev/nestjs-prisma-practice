import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(
      createUserInput.password,
      roundsOfHashing
    );
    createUserInput.password = hashedPassword;
    return this.prisma.user.create({ data: createUserInput });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      const hashedPassword = await bcrypt.hash(
        updateUserInput.password,
        roundsOfHashing
      );
      updateUserInput.password = hashedPassword;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserInput,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
