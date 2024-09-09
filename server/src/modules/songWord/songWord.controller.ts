import { Controller, Get, Param, Query } from '@nestjs/common';
import { SongWordService } from './songWord.service';
import { PositiveNumberPipe } from 'src/customValidators/checkPositiveParam.pipe';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { lyricsSuccResponse } from './songWord.dto';
import { GetSongWordsQueryParams } from './dtos';

@Controller('lyrics')
@ApiTags('lyrics')
export class SongWordController {
  constructor(private readonly songWordService: SongWordService) {}

  @Get('/count')
  async countSongWords(@Query() query: GetSongWordsQueryParams) {
    return this.songWordService.countSongWords(query);
  }

  @Get('/:songId')
  @ApiResponse({ type: lyricsSuccResponse })
  async findAll(@Param('songId', PositiveNumberPipe) id: number) {
    const songWords = await this.songWordService.findBySongId(id);

    return { lyrics: this.songWordService.convertSongWordsToLyrics(songWords) };
  }

  @Get('/search/:word')
  async searchWord(@Param('word') word: string) {
    const songWords = this.songWordService.getSongsByWord(word);
    return songWords;
  }

  @Get('/')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  async findSongWords(@Query() query: GetSongWordsQueryParams) {
    return this.songWordService.findSongWords(query);
  }
}
