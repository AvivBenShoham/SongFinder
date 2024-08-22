import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class WordGroup {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  word: string;

  @Column({ type: 'varchar', length: 50 })
  groupName: string;
}
