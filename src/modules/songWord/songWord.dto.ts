import { ApiProperty } from '@nestjs/swagger';
import { SongDto } from '../song/song.dto';

export class lyricsSuccResponse {
  @ApiProperty({
    type: [[String]], // Nested arrays of strings
    example: [
      [
        'First things first: rest in peace, Uncle Phil',
        'For real',
        'You the only father that I ever knew',
        "I get my bitch pregnant, I'ma be a better you",
        'Prophecies that I made way back in the Ville',
        'Fulfilled',
        'Listen, even back when we was broke, my team ill',
      ],
      [
        'One time for my L.A. sisters',
        'One time for my L.A. ho',
        "Lame niggas can't tell the difference",
      ],
      [
        "Don't save her, she don't wanna be saved",
        "Don't save her, she don't wanna be saved",
      ],
    ],
  })
  lyrics: string[][];
}

export class songOccurancyDto {
  song: SongDto;
  row: number;
  col: number;
  stanza: number;
  line: number;
}

export class SongWordOccurancies {
  word: string;
  songWords: songOccurancyDto[];
}
