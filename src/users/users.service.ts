import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateUserInput {
  name: string;
  email: string;
  role?: Role;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: Role;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  create(input: CreateUserInput) {
    return this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        role: input.role ?? Role.USER,
      },
    });
  }

  update(id: number, input: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id },
      data: input,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
