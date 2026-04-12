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
} from '@nestjs/common';
import { UsersService } from './users.service';

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
  createUser(@Body() body: { name: string }) {
    if (!body || !body.name) {
      throw new BadRequestException('Name is required');
    }
    return this.usersService.create(body.name);
  }

  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: { name?: string }) {
    const name = body?.name?.trim();

    if (!name) {
      throw new BadRequestException('Name is required');
    }

    return this.usersService.update(id, name);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
