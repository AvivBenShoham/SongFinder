import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Song } from '../song/song.entity';
import { Artist } from '../artist/artist.entity';

export enum ContributerType {
  PRODUCER = 'producer',
  SINGER = 'singer',
  WRITER = 'writer',
  COMPOSITOR = 'compositor',
}

@Entity()
export class SongContributer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ContributerType })
  type: ContributerType;

  @ManyToMany(() => Artist, (artist) => artist.contributions)
  artist: Artist;

  @ManyToOne(() => Song, (song) => song.contributers)
  song: Song;
}
