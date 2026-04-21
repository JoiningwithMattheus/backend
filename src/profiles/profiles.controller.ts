import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { ProfilesService } from './profiles.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

type RequestWithUser = {
  user: {
    sub: string;
  };
};

@ApiTags('profiles')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  findMe(@Req() req: RequestWithUser) {
    return this.profilesService.findMe(req.user.sub);
  }
  @Put('me')
  upsertMe(@Req() req: RequestWithUser, @Body() body: UpsertProfileDto) {
    return this.profilesService.upsertMe(req.user.sub, body);
  }
  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.profilesService.findByUsername(username);
  }
}
