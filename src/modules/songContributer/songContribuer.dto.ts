import { ApiProperty } from '@nestjs/swagger';
import { Artist } from '../artist/artist.entity';

export enum ContributerType {
  PRODUCER = 'producer',
  SINGER = 'singer',
  WRITER = 'writer',
  COMPOSITOR = 'compositor',
}

export default class addContributer {
  @ApiProperty({ enum: ContributerType })
  type: ContributerType;

  @ApiProperty({ type: 'string' })
  artistName: Artist['name'];
}
