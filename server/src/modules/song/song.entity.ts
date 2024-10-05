import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SongContributor } from '../songContributor/songContributor.entity';
import { SongWord } from '../songWord/songWord.entity';
import { Artist } from '../artist/artist.entity';
import { SongPhrase } from '../songPhrase/songPhrase.entity';

@Entity({ name: 'songs' })
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  album: string;

  @Column({ type: 'date', name: 'release_date', nullable: true })
  releaseDate: Date;

  @Column({ type: 'date', default: new Date(), name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'cover_url' })
  coverUrl: URL;

  @ManyToOne(() => Artist, (artist) => artist.artistId)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @OneToMany(() => SongWord, (songWord) => songWord.song)
  lyrics: SongWord[];

  @OneToMany(() => SongContributor, (contributor) => contributor.song)
  contributors: SongContributor[];

  @OneToMany(() => SongPhrase, (songPhrase) => songPhrase.phrase)
  phrases: SongPhrase[];
}
