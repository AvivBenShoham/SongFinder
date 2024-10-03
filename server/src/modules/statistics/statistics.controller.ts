import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArtistService } from '../artist/artist.service';
import { SongService } from '../song/song.service';
import { SongWordService } from '../songWord/songWord.service';

@Controller('statistics')
@ApiTags('statistics')
export class StatisticsController {
  constructor(
    private readonly songService: SongService,
    private readonly artistService: ArtistService,
    private readonly songWordService: SongWordService,
  ) {}

  @Get('/')
  async statistics() {
    return {
      counts: {
        songs: await this.songService.getTotalSongs(),
        artists: await this.artistService.getTotalArtists(),
        words: await this.songWordService.getTotalWords(),
      },
      artistWithMostSongs: await this.artistService.getArtistWithMostSongs(),
      wordsWithMostAppearances:
        await this.songWordService.getWordsWithMostAppearances(),
    };
  }
}
