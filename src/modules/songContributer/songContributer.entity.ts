import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Song } from '../song/song.entity';
import { Artist } from '../artist/artist.entity';

export enum ContributorType {
  PRODUCER = 'producer',
  SINGER = 'singer',
  WRITER = 'writer',
  COMPOSITOR = 'compositor',
}

@Entity()
export class SongContributor {
  @PrimaryGeneratedColumn()
  artistId: number;

  @Column()
  songId: number;

  @Column({ type: 'enum', enum: ContributorType })
  type: ContributorType;

  @ManyToOne(() => Artist, (artist) => artist.contributions)
  artist: Artist;

  @ManyToOne(() => Song, (song) => song.contributors)
  song: Song;
}
