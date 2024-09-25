import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createSongPhrase {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phrase: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  songId: number;
}
