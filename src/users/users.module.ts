import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { KeycloakJwtGuard } from 'src/auth/keycloak-jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, KeycloakJwtGuard, RolesGuard],
})
export class UsersModule {}
