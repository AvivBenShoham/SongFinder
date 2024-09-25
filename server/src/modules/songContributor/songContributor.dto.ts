import { ApiProperty } from '@nestjs/swagger';
import { Artist } from '../artist/artist.entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Song } from '../song/song.entity';

export enum ContributorType {
  PRODUCER = 'producer',
  SINGER = 'singer',
  WRITER = 'writer',
  COMPOSITOR = 'compositor',
}

export default class addContributor {
  @ApiProperty({ enum: ContributorType })
  @IsEnum(ContributorType)
  @IsNotEmpty()
  type: ContributorType;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  artistName: Artist['name'];
}

export class createContributorDto {
  type: ContributorType;
  artistId: number;
  song: Song;
}
