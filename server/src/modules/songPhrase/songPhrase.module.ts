import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongPhraseController } from './songPhrase.controller';
import { SongPhrase } from './songPhrase.entity';
import { SongPhraseService } from './songPhrase.service';
import { SongModule } from '../song/song.module';
import { SongWordModule } from '../songWord/songWord.module';

@Module({
  imports: [TypeOrmModule.forFeature([SongPhrase]), SongModule, SongWordModule],
  controllers: [SongPhraseController],
  providers: [SongPhraseService],
  exports: [SongPhraseService],
})
export class SongPhraseModule {}
