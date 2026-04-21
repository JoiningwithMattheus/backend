import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { ShareEntryDto } from './dto/share-entry.dto';

@Injectable()
export class EntriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(ownerSub: string) {
    return this.prisma.journalEntry.findMany({
      where: { ownerSub },
      include: { shares: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, ownerSub: string) {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { id, ownerSub },
    });

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    return entry;
  }

  create(ownerSub: string, dto: CreateEntryDto) {
    return this.prisma.journalEntry.create({
      data: {
        ...dto,
        ownerSub,
      },
    });
  }

  async update(id: number, ownerSub: string, dto: UpdateEntryDto) {
    await this.findOne(id, ownerSub);

    return this.prisma.journalEntry.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, ownerSub: string) {
    await this.findOne(id, ownerSub);

    return this.prisma.journalEntry.delete({
      where: { id },
    });
  }

  async share(entryId: number, ownerSub: string, dto: ShareEntryDto) {
    await this.findOne(entryId, ownerSub);

    return this.prisma.entryShare.create({
      data: {
        entryId,
        recipientUsername: dto.recipientUsername,
      },
    });
  }

  findSharedWithMe(recipientUsername: string) {
    return this.prisma.entryShare.findMany({
      where: { recipientUsername },
      include: { entry: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async unshare(entryId: number, shareId: number, ownerSub: string) {
    await this.findOne(entryId, ownerSub);

    return this.prisma.entryShare.delete({
      where: { id: shareId },
    });
  }
}
