import { Entity, Column, PrimaryColumn, OneToOne, ManyToOne } from 'typeorm';
import { Word } from '../word/word.entity';
import { Song } from '../song/song.entity';

@Entity()
export class SongWord {
  @OneToOne(() => Word, (word) => word.value)
  word: Word

  @Column({ type: 'varchar', length: 30 })
  actualWord: Word

  @ManyToOne(() => Song, (song) => song.songId)
  songId: Song
}
