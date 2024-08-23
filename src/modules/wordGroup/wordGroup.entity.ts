import { Entity, PrimaryColumn } from 'typeorm';
import { Word } from '../word/word.entity';

@Entity({ name: 'word_group' })
export class WordGroup {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  word: Word;

  @PrimaryColumn({ type: 'varchar', length: 50, name: 'group_name' })
  groupName: string;
}
