import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SongWord } from './songWord.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from '../song/song.entity';
import { SongWordOccurancies, songOccurancyDto } from './songWord.dto';

@Injectable()
export class SongWordService {
  constructor(
    @InjectRepository(SongWord)
    private songWordRepository: Repository<SongWord>,
  ) {}

  async findAll(): Promise<SongWord[]> {
    return this.songWordRepository.find();
  }

  async findBySongId(songId: number): Promise<SongWord[]> {
    return this.songWordRepository.findBy({ songId });
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
            songId: songId,
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
