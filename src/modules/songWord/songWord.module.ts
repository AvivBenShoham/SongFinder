import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongWordService } from './songWord.service';
import { SongWordController } from './songWord.controller';
import { SongWord } from './songWord.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SongWord])],
  controllers: [SongWordController],
  providers: [SongWordService],
  exports: [SongWordService],
})
export class SongModule {}
