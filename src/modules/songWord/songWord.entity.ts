import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Song } from '../song/song.entity';
import { Word } from '../word/word.entity';

@Entity({ name: 'song_words' })
export class SongWord {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  word: Word;

  @PrimaryColumn({ type: 'varchar', length: 30 })
  actualWord: string;

  @PrimaryColumn({ type: 'int' })
  @ManyToOne(() => Song, (song) => song.songId)
  @JoinColumn({ name: 'songId' })
  song: Song;

  @PrimaryColumn({ type: 'int' })
  row: number;

  @PrimaryColumn({ type: 'int' })
  col: number;

  @PrimaryColumn({ type: 'int' })
  line: number;

  @PrimaryColumn({ type: 'int' })
  stanza: number;
}
