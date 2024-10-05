import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Song } from '../song/song.entity';

@Entity({ name: 'song_words' })
@Index(['songId', 'line'])
@Index(['songId', 'stanza'])
@Index(['songId', 'word'])
export class SongWord {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  @Index()
  word: string;

  @PrimaryColumn({ type: 'varchar', length: 100, name: 'actual_word' })
  actualWord: string;

  @PrimaryColumn({ type: 'int', name: 'song_id' })
  @Index()
  songId: number;

  @ManyToOne(() => Song, (song) => song.id)
  @JoinColumn({ name: 'song_id' })
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
