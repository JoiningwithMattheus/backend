import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

type RequestWithUser = {
  user: {
    sub: string;
  };
};

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.tasksService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.tasksService.findOne(id, req.user.sub);
  }

  @Post()
  create(@Body() body: CreateTaskDto, @Req() req: RequestWithUser) {
    return this.tasksService.create(req.user.sub, body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto,
    @Req() req: RequestWithUser,
  ) {
    return this.tasksService.update(id, req.user.sub, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.tasksService.remove(id, req.user.sub);
  }
}
