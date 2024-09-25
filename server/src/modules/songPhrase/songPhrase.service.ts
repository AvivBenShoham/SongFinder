import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createSongPhrase } from './songPhrase.dto';
import { SongPhrase } from './songPhrase.entity';
import { SongService } from '../song/song.service';
import { SongWordService } from '../songWord/songWord.service';
import { formatText } from 'src/utils';
import { SongWord } from '../songWord/songWord.entity';

@Injectable()
export class SongPhraseService {
  constructor(
    @InjectRepository(SongPhrase)
    private songPhraseRepository: Repository<SongPhrase>,
    private songService: SongService,
    private songWordService: SongWordService,
  ) {}

  async findAll(): Promise<SongPhrase[]> {
    return this.songPhraseRepository.find();
  }

  private findPhraseOccurrences(songWords: SongWord[], phrase: string) {
    const phraseWords = phrase.split(' ').map(formatText);
    const cleanPhrase = phraseWords.join(' ');
    const phraseLength = phraseWords.length;
    const occurrences = [];

    for (let i = 0; i <= songWords.length - phraseLength; i++) {
      const segment = songWords.slice(i, i + phraseLength);

      if (segment.map(({ word }) => word).join(' ') === cleanPhrase) {
        occurrences.push(segment);
      }
    }

    return occurrences;
  }

  async findAllBySongId(songId: number) {
    const phrases = await this.songPhraseRepository
      .createQueryBuilder('phrase')
      .andWhere('phrase.songId = :songId', {
        songId,
      })
      .getMany();

    const phraseWords = await Promise.all(
      phrases.map(async ({ phrase }) => ({
        phrase,
        songWords: await this.songWordService.getPhraseSongWords(
          songId,
          phrase,
        ),
      })),
    );

    return phraseWords.map(({ phrase, songWords }) => ({
      phrase,
      matches: this.findPhraseOccurrences(songWords, phrase),
    }));
  }

  async insert(songPhrase: createSongPhrase) {
    const song = await this.songService.findOne(songPhrase.songId);

    return this.songPhraseRepository.save({
      phrase: songPhrase.phrase.toLowerCase(),
      song,
    });
  }
}
