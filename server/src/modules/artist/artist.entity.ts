import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SongContributer } from '../songContributer/songContributer.entity';
import { Song } from '../song/song.entity';

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
  imageUrl: string;

  @OneToMany(() => SongContributer, (contributer) => contributer.artist)
  contributions: SongContributer[];

  @OneToMany(() => Song, (song) => song.id)
  songs: Song[];
}
