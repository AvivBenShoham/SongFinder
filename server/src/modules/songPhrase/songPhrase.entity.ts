import { Entity, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Song } from '../song/song.entity';

@Entity({ name: 'song_phrases' })
export class SongPhrase {
  @PrimaryColumn({ type: 'varchar', length: 200 })
  phrase: string;

  @PrimaryColumn({ type: 'varchar', length: 200 })
  actualPhrase: string;

  @PrimaryColumn({ type: 'int' })
  @ManyToOne(() => Song, (song) => song.id)
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
