import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Song } from '../song/song.entity';
import { Artist } from '../artist/artist.entity';
import { ContributerType } from './songContribuer.dto';

@Entity()
export class SongContributer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ContributerType })
  type: ContributerType;

  @Column({ name: 'artist_id' })
  artistId: number;

  @ManyToOne(() => Artist, (artist) => artist.artistId)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @ManyToOne(() => Song, (song) => song.contributers)
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @Column({ name: 'song_id' })
  songId: number;
}
