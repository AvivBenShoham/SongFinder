import { ApiProperty } from '@nestjs/swagger';
import addContributer from '../songContributer/songContribuer.dto';

export default class createSongDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  album?: string;

  @ApiProperty()
  releaseDate: Date;

  @ApiProperty()
  coverUrl?: URL;

  @ApiProperty()
  lyrics: string; // the lyrics are one large string, where stanzas are seperated with an empty line.

  @ApiProperty({ type: () => addContributer, isArray: true })
  contributers: addContributer[];
}
