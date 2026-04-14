import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { KeycloakJwtGuard } from '../auth/keycloak-jwt.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

interface CreateUserBody {
  name?: string;
  email?: string;
  role?: Role;
}

interface UpdateUserBody {
  name?: string;
  email?: string;
  role?: Role;
}

@UseGuards(KeycloakJwtGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles('admin')
  createUser(@Body() body: CreateUserBody) {
    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const role = this.parseRole(body?.role);

    if (!name || !email) {
      throw new BadRequestException('Name and email are required');
    }

    if (name.length < 2) {
      throw new BadRequestException('Name must be at least 2 characters');
    }

    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Email must be valid');
    }

    return this.usersService.create({ name, email, role });
  }

  @Patch(':id')
  @Roles('admin')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserBody,
  ) {
    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const role = this.parseRole(body?.role);

    if (!name && !email && !role) {
      throw new BadRequestException('Name, email, or role is required');
    }

    if (body?.name !== undefined && !name) {
      throw new BadRequestException('Name cannot be empty');
    }

    if (body?.email !== undefined && !email) {
      throw new BadRequestException('Email cannot be empty');
    }

    if (name !== undefined && name.length < 2) {
      throw new BadRequestException('Name must be at least 2 characters');
    }

    if (email !== undefined && !this.isValidEmail(email)) {
      throw new BadRequestException('Email must be valid');
    }

    return this.usersService.update(id, { name, email, role });
  }

  @Delete(':id')
  @Roles('admin')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private parseRole(role: Role | undefined): Role | undefined {
    if (role === undefined) return undefined;

    if (role !== Role.ADMIN && role !== Role.USER) {
      throw new BadRequestException('Role must be ADMIN or USER');
    }

    return role;
  }
}
