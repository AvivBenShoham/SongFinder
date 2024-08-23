import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Word } from '../word/word.entity';

@Entity({ name: 'word_group' })
export class WordGroup {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  word: Word;

  @PrimaryColumn({ type: 'varchar', length: 50 })
  groupName: string;
}
