import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { SongWord } from './songWord.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from '../song/song.entity';
import { SongWordOccurancies, songOccurancyDto } from './songWord.dto';
import { formatText, getQueryParamList } from 'src/utils';
import { GetSongWordsQueryParams } from './dtos';
import * as _ from 'lodash';
import { WordGroupService } from '../wordGroup/wordGroup.service';

@Injectable()
export class SongWordService {
  constructor(
    @InjectRepository(SongWord)
    private songWordRepository: Repository<SongWord>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private wordGroupService: WordGroupService,
  ) {}

  private async buildSongWordsFilter(query: GetSongWordsQueryParams) {
    const songs = getQueryParamList(query.songs).map(formatText);
    const groups = getQueryParamList(query.groups);

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

    // TODO: CHECK IF CAN REFACTOR TO HANDLE THIS WITH JOIN
    if (groups.length > 0) {
      const groupsResult = await this.wordGroupService.findByGroupName(
        ...groups,
      );

      const groupWords = groupsResult.map(({ word }) => word);

      queryBuilder.andWhere('song_word.word IN (:...groupWords)', {
        groupWords,
      });
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

  private async buildSongWordsPagination(query: GetSongWordsQueryParams) {
    const queryBuilder = await this.buildSongWordsFilter(query);

    if (query.page && query.pageSize) {
      queryBuilder
        .addSelect(
          `JSON_AGG(
            JSON_BUILD_OBJECT(
              'word', song_word.word,
              'actualWord', song_word.actual_word,
              'row', song_word.row,
              'col', song_word.col,
              'line', song_word.line,
              'stanza', song_word.stanza,
              'songId', song_word.song_id
            )
          )`,
          'documents',
        )
        .groupBy('song_word.word')
        .orderBy('song_word.word')
        .skip((query.page - 1) * query.pageSize)
        .take(query.pageSize);
    }

    return queryBuilder;
  }

  async countSongWords(query: GetSongWordsQueryParams) {
    const countQuery = (await this.buildSongWordsFilter(query)).select(
      'COUNT(DISTINCT song_word.word)',
      'count',
    );

    const result = await countQuery.getRawOne();
    return parseInt(result.count, 10);
  }

  async findSongWords(query: GetSongWordsQueryParams) {
    const songWords = await (
      await this.buildSongWordsPagination(query)
    ).getRawMany();

    const songIds = _.uniq(
      songWords.flatMap(({ documents }) => documents.map((doc) => doc.songId)),
    );

    const songs = await this.songRepository.find({
      where: { id: In(songIds) },
      relations: ['artist'],
      select: { id: true, name: true, artist: { name: true } },
    });

    const songsMap = _.keyBy(songs, 'id');

    return songWords.map((songWord) => ({
      ...songWord,
      documents: songWord.documents.map((doc) => ({
        ...doc,
        songName: songsMap[doc.songId].name,
        songArtist: songsMap[doc.songId].artist.name,
      })),
    }));
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

  async getPhraseSongWords(songId: number, phrase: string) {
    const words = phrase.split(' ').map(formatText);

    const queryBuilder = this.songWordRepository
      .createQueryBuilder('song_word')
      .where('song_word.song = :songId', { songId })
      .andWhere('song_word.word IN (:...words)', {
        words,
      })
      .orderBy('song_word.row, song_word.col');

    return queryBuilder.getMany();
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

  convertSongWordsToLyrics(songWords: SongWord[]): string[][] {
    songWords.sort((a, b) => {
      if (a.stanza !== b.stanza) return a.stanza - b.stanza;
      if (a.line !== b.line) return a.line - b.line;
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });

    return _.chain(songWords)
      .groupBy('stanza')
      .map((stanza) =>
        _.chain(stanza)
          .groupBy('line')
          .map((words) => words.map((word) => word.actualWord).join(' '))
          .value(),
      )
      .value();
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
        line
          .replace(/\s+/g, ' ')
          .split(' ')
          .forEach((word) => {
            const songWord: SongWord = {
              actualWord: word,
              word: formatText(word),
              line: currLine,
              stanza: currStanza,
              col: currColl,
              row: currRow,
              song,
              songId: song.id,
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

  async getWordsWithMostAppearances(): Promise<
    [{ word: string; count: number }]
  > {
    const result = this.songWordRepository
      .createQueryBuilder('song_word')
      .select('song_word.word', 'word')
      .addSelect('COUNT(song_word.word)', 'count')
      .groupBy('song_word.word')
      .orderBy('count', 'DESC')
      .limit(5)
      .execute();

    return result;
  }

  async getTotalWords(): Promise<number> {
    const result = await this.songWordRepository
      .createQueryBuilder('song_word')
      .select('COUNT(song_word.actual_word)', 'count')
      .getRawOne();

    return parseInt(result.count);
  }
}
