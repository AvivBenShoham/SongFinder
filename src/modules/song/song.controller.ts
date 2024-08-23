import { Body, Controller, Get, Post } from '@nestjs/common';
import { SongService } from './song.service';
import createSongDto from './song.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get('')
  async findAll() {
    return this.songService.findAll();
  }

  @Post()
  @ApiBody({ type: createSongDto })
  async create(@Body() createSongDto: createSongDto) {
    const hara = createSongDto;
    return 'shit';
  }
}
