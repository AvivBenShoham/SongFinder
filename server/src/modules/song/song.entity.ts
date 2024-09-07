import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SongContributer } from '../songContributer/songContributer.entity';
import { SongWord } from '../songWord/songWord.entity';

@Entity({ name: 'songs' })
export class Song {
  @PrimaryGeneratedColumn()
  songId: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  album: string;

  @Column({ type: 'date', name: 'release_date' })
  releaseDate: Date;

  @Column({ type: 'date', default: new Date(), name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'cover_url' })
  coverUrl: URL;

  @OneToMany(() => SongWord, (songWord) => songWord.song)
  lyrics: SongWord[];

  @OneToMany(() => SongContributer, (contributer) => contributer.song)
  contributers: SongContributer[];
}
