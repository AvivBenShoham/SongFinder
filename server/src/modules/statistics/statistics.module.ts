import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { SongWordModule } from '../songWord/songWord.module';
import { SongModule } from '../song/song.module';
import { ArtistModule } from '../artist/artist.module';

@Module({
  imports: [SongWordModule, SongModule, ArtistModule],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
