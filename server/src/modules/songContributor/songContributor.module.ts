import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongContributor } from './songContributor.entity';
import { SongContributorService } from './songContributor.service';
import { ArtistModule } from '../artist/artist.module';

@Module({
  imports: [TypeOrmModule.forFeature([SongContributor]), ArtistModule],
  providers: [SongContributorService],
  exports: [SongContributorService],
})
export class SongContributorModule {}
