import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { SongContributer } from '../songContributer/songContributer.entity';
import { formatText } from 'src/utils';

@Entity({ name: 'artists' })
export class Artist {
  @PrimaryGeneratedColumn()
  artistId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'image_url',
  })
  imageUrl: URL;

  @OneToMany(() => SongContributer, (contributer) => contributer.artist)
  contributions: SongContributer[];
}
