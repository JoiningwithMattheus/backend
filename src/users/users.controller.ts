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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
  createUser(@Body() body: CreateUserDto) {
    if (
      body.name === undefined &&
      body.email === undefined &&
      body.role === undefined
    ) {
      throw new BadRequestException('Name, email, or role is required');
    }

    return this.usersService.create(body);
  }

  @Patch(':id')
  @Roles('admin')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    if (
      body.name === undefined &&
      body.email === undefined &&
      body.role === undefined
    ) {
      throw new BadRequestException('Name, email, or role is required');
    }

    return this.usersService.update(id, body);
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
