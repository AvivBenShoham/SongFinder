import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SongWord } from './songWord.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from '../song/song.entity';
import { SongWordOccurancies, songOccurancyDto } from './songWord.dto';
import { formatText, getQueryParamList } from 'src/utils';
import { GetSongWordsQueryParams } from './dtos';

@Injectable()
export class SongWordService {
  constructor(
    @InjectRepository(SongWord)
    private songWordRepository: Repository<SongWord>,
  ) {}

  private buildSongWordsFilter(query: GetSongWordsQueryParams) {
    const songs = getQueryParamList(query.songs).map(formatText);

    const queryBuilder = this.songWordRepository
      .createQueryBuilder('song_word')
      .select('song_word.word', 'word')
      .where("song_word.word ~* '^[a-z]+$'")
      .andWhere("song_word.word NOT IN ('a', 'an', 'the')");

    if (query.word) {
      const searchString = `%${query.word}%`;
      queryBuilder.andWhere('song_word.word LIKE :searchString', {
        searchString,
      });
    }

    if (songs.length > 0) {
      queryBuilder.andWhere('song_word.song IN (:...songs)', { songs });
    }

    const positions = {
      col: query.col,
      row: query.row,
      stanza: query.stanza,
      line: query.line,
    };

    Object.entries(positions).forEach(([key, value]) => {
      if (value) {
        queryBuilder.andWhere(`song_word.${key} = :${key}`, {
          [key]: value,
        });
      }
    });

    return queryBuilder;
  }

  private buildSongWordsPagination(query: GetSongWordsQueryParams) {
    const queryBuilder = this.buildSongWordsFilter(query);

    if (query.page && query.pageSize) {
      queryBuilder
        .addSelect(`JSON_AGG(song_word)`, 'documents')
        .groupBy('song_word.word')
        .orderBy('song_word.word')
        .skip((query.page - 1) * query.pageSize)
        .take(query.pageSize);
    }

    return queryBuilder;
  }

  async countSongWords(query: GetSongWordsQueryParams) {
    const countQuery = this.buildSongWordsFilter(query).select(
      'COUNT(DISTINCT song_word.word)',
      'count',
    );

    const result = await countQuery.getRawOne();
    return parseInt(result.count, 10);
  }

  async findSongWords(query: GetSongWordsQueryParams) {
    return this.buildSongWordsPagination(query).getRawMany();
  }

  async findBySongId(id: number): Promise<SongWord[]> {
    return this.songWordRepository.find({
      where: {
        song: { id },
      },
    });
  }

  async findByName(word: string): Promise<SongWord[]> {
    return this.songWordRepository
      .createQueryBuilder('songWord')
      .where('word like :name', { name: `%${word}%` })
      .getMany();
  }

  async getSongsByWord(word: string): Promise<Song[]> {
    const songWords = await this.songWordRepository.find({
      where: { word },
      relations: ['song'],
    });

    const songs = songWords.map((songWord) => songWord.song);
    return songs;
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

  // Response: array of stanzas according to lines
  convertSongWordsToLyrics(songWords: SongWord[]): string[][] {
    // Sort songWords to ensure the correct order based on their properties
    songWords.sort((a, b) => {
      if (a.stanza !== b.stanza) return a.stanza - b.stanza;
      if (a.line !== b.line) return a.line - b.line;
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });

    const stanzas: string[][] = [];
    let currentStanza = 1;
    let currentLine = 1;
    let currentLineWords: string[] = [];
    let currentStanzaLines: string[] = [];

    songWords.forEach((songWord) => {
      // Add a new stanza if needed
      if (songWord.stanza > currentStanza) {
        stanzas.push(currentStanzaLines);
        currentStanza = songWord.stanza;
        currentLine = 1;
        currentLineWords = [];
        currentStanzaLines = [];
      }

      // Add a new line if needed
      if (songWord.line > currentLine) {
        currentStanzaLines.push(currentLineWords.join(' '));
        currentLineWords = [];
        currentLine = songWord.line;
      }

      // Add the word to the current line
      while (currentLineWords.length < songWord.col - 1) {
        currentLineWords.push('');
      }
      currentLineWords[songWord.col - 1] = songWord.actualWord;
    });

    // Push the last line and stanza if they have content
    if (currentLineWords.length > 0) {
      stanzas.push(currentStanzaLines);
    }

    return stanzas;
  }

  convertLyricsToSongWords(lyrics: string, song: Song): SongWord[] {
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
            word: formatText(word),
            line: currLine,
            stanza: currStanza,
            col: currColl,
            row: currRow,
            song,
          };
          songWords.push(songWord);
          currColl++;
        });
        currLine++;
      }

      currRow++;
    });
    return songWords;
  }

  async findAllWithOccurrences(): Promise<SongWordOccurancies[]> {
    const allSongWordsPopulated = await this.songWordRepository.find({
      relations: ['song'],
    });

    // Initialize a map to hold the data
    const wordMap = new Map<
      string,
      { word: string; songWords: songOccurancyDto[] }
    >();
    allSongWordsPopulated.forEach((songWord) => {
      const word = songWord.word;
      const songOcc = this.castSongWordToSongWordOccDto(songWord);
      if (!wordMap.has(word)) {
        wordMap.set(word, { word, songWords: [songOcc] });
      } else {
        wordMap.get(word).songWords.push(songOcc);
      }
    });

    return Array.from(wordMap.values());
  }

  castSongWordToSongWordOccDto(songWord: SongWord): songOccurancyDto {
    return {
      col: songWord.col,
      row: songWord.row,
      stanza: songWord.stanza,
      line: songWord.line,
      song: {
        name: songWord.song.name,
        album: songWord.song.album,
        coverUrl: songWord.song.coverUrl,
        releaseDate: songWord.song.releaseDate,
      },
    };
  }
}
