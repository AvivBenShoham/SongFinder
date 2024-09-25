import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SongPhraseService } from './songPhrase.service';
import { ApiTags } from '@nestjs/swagger';
import { createSongPhrase } from './songPhrase.dto';

@Controller('phrases')
@ApiTags('songPhrase')
export class SongPhraseController {
  constructor(private readonly songPhraseService: SongPhraseService) {}

  @Get('/:songId')
  async findBySong(@Param('songId', ParseIntPipe) songId: number) {
    return this.songPhraseService.findAllBySongId(songId);
  }

  @Post()
  async insertSongPhrase(@Body() newSongPhrase: createSongPhrase) {
    return this.songPhraseService.insert(newSongPhrase);
  }
}
