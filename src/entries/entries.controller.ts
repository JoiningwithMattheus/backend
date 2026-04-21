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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { EntriesService } from './entries.service';
import { ShareEntryDto } from './dto/share-entry.dto';

type RequestWithUser = {
  user: {
    sub: string;
    username: string;
  };
};

@ApiTags('entries')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
@UseGuards(JwtAuthGuard)
@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @ApiOkResponse({
    description: 'Returns private entries for the signed-in user',
  })
  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.entriesService.findAll(req.user.sub);
  }

  @ApiOkResponse({
    description: 'Returns one private entry owned by the signed-in user',
  })
  @Get('shared-with-me')
  findSharedWithMe(@Req() req: RequestWithUser) {
    return this.entriesService.findSharedWithMe(req.user.username);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.entriesService.findOne(id, req.user.sub);
  }

  @ApiCreatedResponse({ description: 'Creates a private journal entry' })
  @Post()
  create(@Body() body: CreateEntryDto, @Req() req: RequestWithUser) {
    return this.entriesService.create(req.user.sub, body);
  }

  @ApiOkResponse({ description: 'Updates a private journal entry' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEntryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.entriesService.update(id, req.user.sub, body);
  }

  @ApiOkResponse({ description: 'Deletes a private journal entry' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.entriesService.remove(id, req.user.sub);
  }

  @Post(':id/shares')
  share(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ShareEntryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.entriesService.share(id, req.user.sub, body);
  }

  @Delete(':id/shares/:shareId')
  unshare(
    @Param('id', ParseIntPipe) id: number,
    @Param('shareId', ParseIntPipe) shareId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.entriesService.unshare(id, shareId, req.user.sub);
  }
}
