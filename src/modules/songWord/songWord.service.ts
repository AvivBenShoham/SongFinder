import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SongWord } from './songWord.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SongWordService {
  constructor(
    @InjectRepository(SongWord)
    private songWordRepository: Repository<SongWord>,
  ) {}

  async findAll(): Promise<SongWord[]> {
    return this.songWordRepository.find();
  }

  async findBySongId(songId: number): Promise<SongWord> {
    return this.songWordRepository.findOneBy({ song: songId });
  }

  async findByName(word: string): Promise<SongWord[]> {
    return this.songWordRepository
      .createQueryBuilder('songWord')
      .where('word like :name', { name: `%${word}%` })
      .getMany();
  }

  // only for internal backend usage
  async insert(songWord: SongWord): Promise<SongWord> {
    const newSongWord = this.songWordRepository.create(songWord);
    return this.songWordRepository.save(newSongWord);
  }

  async insertMany(songWords: SongWord[]): Promise<SongWord[]> {
    const newSongWords = this.songWordRepository.create(songWords);
    return this.songWordRepository.save(newSongWords);
  }

  convertLyricsToSongWords(lyrics: string, songId: number): SongWord[] {
    const songWords: SongWord[] = [];
    let currLine = 1;
    let currRow = 1;
    let currStanza = 1;
    lyrics.split('\n').forEach((line) => {
      // if the line is seperating between stanzas
      if (line === '') {
        currStanza++;
        currLine = 1;
      } else {
        let currColl = 1;
        line.split(' ').forEach((word) => {
          const songWord: SongWord = {
            actualWord: word,
            word: word.toLocaleLowerCase(),
            line: currLine,
            stanza: currStanza,
            col: currColl,
            row: currRow,
            song: songId,
          };
          songWords.push(songWord);
          currColl++;
        });
      }

      currRow++;
    });
    return songWords;
  }
}
