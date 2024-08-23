import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SongContributer } from '../songContributer/songContributer.entity';

@Entity({ name: 'artists' })
export class Artist {
  @PrimaryGeneratedColumn()
  artistId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: URL;

  @OneToMany(() => SongContributer, (contributer) => contributer.artist)
  contributions: SongContributer[];
}
