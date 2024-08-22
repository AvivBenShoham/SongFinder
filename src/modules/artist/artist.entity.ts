import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SongContributor } from '../songContributer/songContributer.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  artistId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  imageUrl: URL;

  @OneToMany(() => SongContributor, (contributor) => contributor.artist)
  contributions: SongContributor[];
}
