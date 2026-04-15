import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error('DATABASE_URL is not set.');
    }

    super({
      adapter: new PrismaPg({ connectionString }),
    });
  }
  async onModuleInit() {
    await this.connectWithRetry();
  }
  private async connectWithRetry(
    maxAttempts = 10,
    delayMs = 2000,
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.$connect();
        console.log('Prisma connected to Postgres');
        return;
      } catch (error) {
        console.error(
          `Prisma connection failed. Attempt ${attempt}/${maxAttempts}`,
        );

        if (attempt === maxAttempts) {
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
}
