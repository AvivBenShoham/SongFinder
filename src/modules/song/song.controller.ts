import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { SongService } from './song.service';
import createSongReqDto from './song.dto';
import { ApiBody } from '@nestjs/swagger';
import { SongWordService } from '../songWord/songWord.service';
import { ArtistService } from '../artist/artist.service';
import { createContributerDto } from '../songContributer/songContribuer.dto';
import { SongContributerService } from '../songContributer/songContributer.service';

@Controller('songs')
export class SongController {
  constructor(
    private readonly songService: SongService,
    private readonly songWordService: SongWordService,
    private readonly artistService: ArtistService,
    private readonly contributerService: SongContributerService,
  ) {}

  @Get('')
  async findAll() {
    return this.songService.findAll();
  }

  @Post()
  @ApiBody({ type: createSongReqDto })
  async create(@Body() createSongDto: createSongReqDto) {
    try {
      //TODO: add check that the song not already exists - based on song name and artist
      const isAllArtistsExists = await this.artistService.checkIfExists(
        createSongDto.contributers.map((contribuer) => contribuer.artistName),
      );

      if (!isAllArtistsExists)
        throw new BadRequestException('Not all artists exists');

      const { songId } = await this.songService.insert(createSongDto);
      const contributers = (await this.artistService.addIdsByNames(
        createSongDto.contributers,
      )) as unknown as createContributerDto[];


      await this.contributerService.insertMany(contributers);
      const songWords = this.songWordService.convertLyricsToSongWords(
        createSongDto.lyrics,
        songId,
      );

      this.songWordService.insertMany(songWords);
      // TODO: should I insert to the word table? why does that table exists anyway?
      return { success: true };
    } catch (err) {
      console.error(err);
    }
  }
}
