import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { Song } from '../song/song.entity';

@Entity({ name: 'song_phrases' })
export class SongPhrase {
  @PrimaryColumn({ type: 'varchar', length: 400 })
  phrase: string;

  @ManyToOne(() => Song, (song) => song.id)
  @PrimaryColumn({ type: 'int', name: 'songId' })
  song: Song;
}
