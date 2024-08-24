import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { SongService } from './song.service';
import createSongReqDto, {
  createSongBadRequest,
  createSongSuccResponse,
} from './song.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { SongWordService } from '../songWord/songWord.service';
import { ArtistService } from '../artist/artist.service';
import addContributer, {
  ContributerType,
  createContributerDto,
} from '../songContributer/songContribuer.dto';
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
  @ApiCreatedResponse({ type: createSongSuccResponse })
  @ApiBadRequestResponse({ type: createSongBadRequest })
  async create(@Body() createSongDto: createSongReqDto) {
    const isAlreadyExists =
      await this.songService.findSongByNameAndContributers(createSongDto);
    //TODO: add transactions
    if (isAlreadyExists)
      throw new BadRequestException('the song already exists');
    const isAllArtistsExists = await this.artistService.checkIfExists(
      createSongDto.contributers.map((contribuer) => contribuer.artistName),
    );

    if (!isAllArtistsExists)
      throw new BadRequestException('Not all artists exists');

    const { songId } = await this.songService.insert(createSongDto);

    const contributers = await this.createContributers(
      createSongDto.contributers,
      songId,
    );

    const songWords = this.songWordService.convertLyricsToSongWords(
      createSongDto.lyrics,
      songId,
    );

    await this.songWordService.insertMany(songWords);
    return { success: true, songId, contributers, songWords };
  }

  async createContributers(basicContributer: addContributer[], songId: number) {
    const contributers = (await this.artistService.changeNamesToIds(
      basicContributer,
    )) as Array<{
      artistId: number;
      type: ContributerType;
    }>;

    const contributersToCreate: Array<createContributerDto> = contributers.map(
      (contributer) => {
        return { ...contributer, songId };
      },
    );

    return await this.contributerService.insertMany(contributersToCreate);
  }
}
