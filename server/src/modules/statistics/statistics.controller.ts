import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArtistService } from '../artist/artist.service';
import { SongService } from '../song/song.service';
import { SongWordService } from '../songWord/songWord.service';
import { PositiveNumberPipe } from 'src/customValidators/checkPositiveParam.pipe';

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
      wordsWithMostAppearances:
        await this.songWordService.getWordsWithMostAppearances(),
    };
  }

  @Get('/artistWithMostSongs')
  @ApiTags('statistics')
  async artistWithMostSongs(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    console.log('page', page);
    console.log('pageSize', pageSize);
    return this.artistService.getArtistWithMostSongs(page, pageSize);
  }
}
