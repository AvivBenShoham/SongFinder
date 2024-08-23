import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Song } from '../song/song.entity';

@Entity({ name: 'song_words' })
export class SongWord {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  word: string;

  @PrimaryColumn({ type: 'varchar', length: 30, name: 'actual_word' })
  actualWord: string;

  @PrimaryColumn({ type: 'int' })
  @ManyToOne(() => Song, (song) => song.songId)
  @JoinColumn({ name: 'songId' })
  song: number;

  @PrimaryColumn({ type: 'int' })
  row: number;

  @PrimaryColumn({ type: 'int' })
  col: number;

  @PrimaryColumn({ type: 'int' })
  line: number;

  @PrimaryColumn({ type: 'int' })
  stanza: number;
}
