import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(ownerSub: string) {
    return this.prisma.task.findMany({
      where: { ownerSub },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, ownerSub: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, ownerSub },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  create(ownerSub: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...dto,
        ownerSub,
      },
    });
  }

  async update(id: number, ownerSub: string, dto: UpdateTaskDto) {
    await this.findOne(id, ownerSub);

    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, ownerSub: string) {
    await this.findOne(id, ownerSub);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
