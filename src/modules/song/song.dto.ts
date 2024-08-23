import { ApiProperty } from '@nestjs/swagger';
import addContributer from '../songContributer/songContribuer.dto';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export default class createSongDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  album?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  releaseDate: Date;

  @ApiProperty()
  @IsUrl({}, { message: 'Invalid URL format' })
  @IsString()
  @IsOptional()
  coverUrl?: URL;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lyrics: string; // the lyrics are one large string, where stanzas are seperated with an empty line.

  @ApiProperty({ type: () => addContributer, isArray: true })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => addContributer)
  contributers: addContributer[];
}
