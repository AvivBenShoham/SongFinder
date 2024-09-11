import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'word_group' })
export class WordGroup {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  word: string;

  @PrimaryColumn({ type: 'varchar', length: 50, name: 'group_name' })
  groupName: string;
}
