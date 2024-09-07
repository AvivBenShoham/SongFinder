import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongContributer } from './songContributer.entity';
import { SongContributerService } from './songContributer.service';

@Module({
  imports: [TypeOrmModule.forFeature([SongContributer])],
  providers: [SongContributerService],
  exports: [SongContributerService],
})
export class SongContributerModule {}
