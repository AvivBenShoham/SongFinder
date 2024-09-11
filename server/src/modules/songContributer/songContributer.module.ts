import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongContributer } from './songContributer.entity';
import { SongContributerService } from './songContributer.service';
import { ArtistModule } from '../artist/artist.module';

@Module({
  imports: [TypeOrmModule.forFeature([SongContributer]), ArtistModule],
  providers: [SongContributerService],
  exports: [SongContributerService],
})
export class SongContributerModule {}
