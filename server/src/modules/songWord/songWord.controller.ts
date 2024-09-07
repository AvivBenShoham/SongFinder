import { Controller, Get, Param } from '@nestjs/common';
import { SongWordService } from './songWord.service';
import { PositiveNumberPipe } from 'src/customValidators/checkPositiveParam.pipe';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { lyricsSuccResponse } from './songWord.dto';

@Controller('lyrics')
@ApiTags('lyrics')
export class SongWordController {
  constructor(private readonly songWordService: SongWordService) {}

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
}
