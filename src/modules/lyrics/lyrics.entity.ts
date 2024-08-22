import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Song } from '../song/song.entity';

@Entity()
export class Lyrics {
  @PrimaryGeneratedColumn()
  songId: number;

  @Column()
  row: number;

  @Column()
  col: number;

  @Column()
  line: number;

  @Column()
  stanza: number;

  @ManyToOne(() => Song, (song) => song.lyrics)
  song: Song;
}
