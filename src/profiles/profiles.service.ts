import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}
  findMe(cognitoSub: string) {
    return this.prisma.userProfile.findUnique({
      where: { cognitoSub },
    });
  }

  upsertMe(cognitoSub: string, dto: UpsertProfileDto) {
    return this.prisma.userProfile.upsert({
      where: { cognitoSub },
      update: {
        username: dto.username,
        displayName: dto.displayName,
      },
      create: {
        cognitoSub,
        username: dto.username,
        displayName: dto.displayName,
      },
    });
  }
  findByUsername(username: string) {
    return this.prisma.userProfile.findUnique({
      where: { username },
    });
  }
}
