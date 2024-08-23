import { Body, Controller, Get, Post } from '@nestjs/common';
import { SongService } from './song.service';
import createSongReqDto from './song.dto';
import { ApiBody } from '@nestjs/swagger';
import { SongWordService } from '../songWord/songWord.service';

@Controller('songs')
export class SongController {
  constructor(
    private readonly songService: SongService,
    private readonly songWordService: SongWordService,
  ) {}

  @Get('')
  async findAll() {
    return this.songService.findAll();
  }

  @Post()
  @ApiBody({ type: createSongReqDto })
  async create(@Body() createSongDto: createSongReqDto) {

    const { songId } = await this.songService.insert(createSongDto);
    //TODO: insert contributers
    //TODO: insert artists if does not exists

    const songWords = this.songWordService.convertLyricsToSongWords(
      createSongDto.lyrics,
      songId,
    );

    this.songWordService.insertMany(songWords);

    return { success: true };
  }
}
