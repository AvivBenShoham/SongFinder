import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongContributer } from './songContributer.entity';
import { SongContributerService } from './songContributer.service';
// import { SongContributerCon } from './songContributer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SongContributer])],
//   controllers: [SongController],
  providers: [SongContributerService],
  exports: [SongContributerService],
})
export class SongModule {}
