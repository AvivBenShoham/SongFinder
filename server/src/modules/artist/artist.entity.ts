import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SongContributor } from '../songContributor/songContributor.entity';
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

  @OneToMany(() => SongContributor, (contributor) => contributor.artist)
  contributions: SongContributor[];

  @OneToMany(() => Song, (song) => song.id)
  songs: Song[];
}
