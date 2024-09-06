import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SongContributer } from '../songContributer/songContributer.entity';
import { SongWord } from '../songWord/songWord.entity';

@Entity({ name: 'songs' })
export class Song {
  @PrimaryGeneratedColumn()
  songId: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  album: string;

  @Column({ type: 'date', name: 'release_date' })
  releaseDate: Date;

  @Column({ type: 'date', default: new Date(), name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'cover_url' })
  coverUrl: URL;

  //TODO: fix primary column and shit like that
  @OneToMany(() => SongWord, (songWord) => songWord.word)
  lyrics: SongWord[];

  @OneToMany(() => SongContributer, (contributer) => contributer.song)
  contributers: SongContributer[];
}
