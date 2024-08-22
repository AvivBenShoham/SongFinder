import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Word {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  value: string;
}
