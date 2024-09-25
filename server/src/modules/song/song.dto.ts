import { ApiProperty } from '@nestjs/swagger';
import addContributor from '../songContributor/songContributor.dto';
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
import { SongContributor } from '../songContributor/songContributor.entity';
import { SongWord } from '../songWord/songWord.entity';
import { Artist } from '../artist/artist.entity';

export default class createSongReqDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  album?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  artistName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  artistImageUrl?: string;

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

  @ApiProperty({ type: () => addContributor, isArray: true })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => addContributor)
  contributors: addContributor[];
}

export class createSongDto {
  name: string;
  album?: string;
  releaseDate: Date;
  coverUrl?: URL;
  artist?: Artist;
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
  contributors: SongContributor[];

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
