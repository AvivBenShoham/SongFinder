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
import { SongContributer } from '../songContributer/songContributer.entity';
import { SongWord } from '../songWord/songWord.entity';

export default class createSongReqDto {
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
  @IsUrl({ require_tld: false }, { message: 'Invalid URL format' })
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

export class createSongDto {
  name: string;
  album?: string;
  releaseDate: Date;
  coverUrl?: URL;
}

export class createSongSuccResponse {
  @ApiProperty({ example: true })
  success: boolean;
  @ApiProperty({ example: 3 })
  songId: number;
  @ApiProperty({
    example: [
      {
        type: 'producer',
        artistId: 6,
        songId: 3,
        id: 4,
      },
    ],
  })
  contributers: SongContributer[];

  @ApiProperty({
    example: [
      {
        actualWord: 'string',
        word: 'string',
        line: 1,
        stanza: 1,
        col: 1,
        row: 1,
        songId: 3,
      },
    ],
  })
  songWords: SongWord[];
}

export class createSongBadRequest {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'The song already exists' })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class SongDto {
  name: string;
  album: string;
  releaseDate: Date;
  coverUrl: URL;
}
