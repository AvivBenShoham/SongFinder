import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Song } from '../song/song.entity';
import { Artist } from '../artist/artist.entity';
import { ContributorType } from './songContributor.dto';

@Entity()
export class SongContributor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ContributorType })
  type: ContributorType;

  @Column({ name: 'artist_id' })
  artistId: number;

  @ManyToOne(() => Artist, (artist) => artist.artistId)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @ManyToOne(() => Song, (song) => song.contributors)
  song: Song;
}
