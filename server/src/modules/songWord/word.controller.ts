import { Controller, Get } from '@nestjs/common';
import { SongWordService } from './songWord.service';

@Controller('words')
export class WordController {
  constructor(private readonly songWordService: SongWordService) {}

  @Get('/allWithOccurrences')
  async findAllWithOccurrences() {
    const songWords = await this.songWordService.findAllWithOccurrences();
    return songWords;
  }
}
