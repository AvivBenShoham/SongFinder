import { Controller, Get, Param } from '@nestjs/common';
import { SongWordService } from './songWord.service';
import { PositiveNumberPipe } from 'src/customValidators/checkPositiveParam.pipe';

@Controller('songWord')
export class SongWordController {
  constructor(private readonly songWordService: SongWordService) {}

  @Get('/:songId')
  async findAll(@Param('songId', PositiveNumberPipe) id: number) {
    const songWords = this.songWordService.findBySongId(id);
    return songWords;
  }

  @Get('/search/:word')
  async searchWord(@Param('word') word: string) {
    const songWords = this.songWordService.getSongsByWord(word);
    return songWords;
  }
}
