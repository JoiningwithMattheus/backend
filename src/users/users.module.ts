import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { KeycloakJwtGuard } from 'src/auth/keycloak-jwt.guard';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, KeycloakJwtGuard],
})
export class UsersModule {}
