import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SongContributor } from '../songContributer/songContributer.entity';
import { SongWord } from '../songWord/songWord.entity';

@Entity({ name: 'songs' })
export class Song {
  @PrimaryGeneratedColumn()
  songId: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  album: string;

  @Column({ type: 'date' })
  releaseDate: Date;

  @Column({ type: 'date', default: new Date() })
  createdAt: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverUrl: URL;

  @OneToMany(() => SongWord, (songWord) => songWord.word)
  lyrics: SongWord[];

  @OneToMany(() => SongContributor, (contributor) => contributor.song)
  contributors: SongContributor[];
}
