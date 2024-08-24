import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { SongContributer } from '../songContributer/songContributer.entity';

@Entity({ name: 'artists' })
export class Artist {
  @PrimaryGeneratedColumn()
  artistId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'lowercased_name',
    unique: true, // because we need some identifier to identify artist when receiving a request
  })
  lowercasedName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'image_url',
  })
  imageUrl: URL;

  @OneToMany(() => SongContributer, (contributer) => contributer.artist)
  contributions: SongContributer[];

  @BeforeInsert()
  setLowercasedName() {
    this.lowercasedName = this.name.toLowerCase();
  }
}
