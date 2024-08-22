import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Lyrics } from '../lyrics/lyrics.entity';
import { SongContributor } from '../songContributer/songContributer.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  songId: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  album: string;

  @Column({ type: 'date' })
  releaseDate: Date;

  @Column({ type: 'varchar', length: 500 })
  coverUrl: string;

  @OneToMany(() => Lyrics, (lyrics) => lyrics.song)
  lyrics: Lyrics[];

  @OneToMany(() => SongContributor, (contributor) => contributor.song)
  contributors: SongContributor[];
}