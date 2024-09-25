import { Entity, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Song } from '../song/song.entity';

@Entity({ name: 'song_phrases' })
export class SongPhrase {
  @PrimaryColumn({ type: 'varchar', length: 400 })
  phrase: string;

  @ManyToOne(() => Song, (song) => song.id)
  song: Song;
}
