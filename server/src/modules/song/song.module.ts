import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { SongContributerModule } from '../songContributer/songContributer.module';
import { SongWordModule } from '../songWord/songWord.module';
import { ArtistModule } from '../artist/artist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song]),
    SongContributerModule,
    SongWordModule,
    ArtistModule,
  ],
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService],
})
export class SongModule {}
