import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { SongContributer } from '../songContributer/songContributer.entity';

@Entity({ name: 'artists' })
export class Artist {
  @PrimaryGeneratedColumn()
  artistId: number;

  @PrimaryColumn({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'lowercased_name',
    unique: true,
  })
  lowercasedName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'image_url',
  })
  imageUrl: URL;

  @OneToMany(() => SongContributer, (contributer) => contributer.artistId)
  contributions: SongContributer[];
}
