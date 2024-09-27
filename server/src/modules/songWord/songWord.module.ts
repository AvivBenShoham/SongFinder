import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongWordService } from './songWord.service';
import { SongWordController } from './songWord.controller';
import { SongWord } from './songWord.entity';
import { WordController } from './word.controller';
import { Song } from '../song/song.entity';
import { WordGroupModule } from '../wordGroup/wordGroup.module';

@Module({
  imports: [TypeOrmModule.forFeature([SongWord, Song]), WordGroupModule],
  controllers: [SongWordController, WordController],
  providers: [SongWordService],
  exports: [SongWordService, TypeOrmModule],
})
export class SongWordModule {}
