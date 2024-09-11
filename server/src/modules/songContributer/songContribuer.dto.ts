import { ApiProperty } from '@nestjs/swagger';
import { Artist } from '../artist/artist.entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Song } from '../song/song.entity';

export enum ContributerType {
  PRODUCER = 'producer',
  SINGER = 'singer',
  WRITER = 'writer',
  COMPOSITOR = 'compositor',
}

export default class addContributer {
  @ApiProperty({ enum: ContributerType })
  @IsEnum(ContributerType)
  @IsNotEmpty()
  type: ContributerType;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  artistName: Artist['name'];
}

export class createContributerDto {
  type: ContributerType;
  artistId: number;
  song: Song;
}
