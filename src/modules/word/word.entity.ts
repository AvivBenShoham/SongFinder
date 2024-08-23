import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'words' })
export class Word {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  value: string;
}
