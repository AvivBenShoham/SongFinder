import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
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
  ApiTags,
} from '@nestjs/swagger';
import { SongWordService } from '../songWord/songWord.service';
import { ArtistService } from '../artist/artist.service';
import addContributer, {
  ContributerType,
  createContributerDto,
} from '../songContributer/songContribuer.dto';
import { SongContributerService } from '../songContributer/songContributer.service';
import { getSongById } from 'genius-lyrics-api';
import { Song } from './song.entity';
import { GetSongsQueryParams } from './dtos';

@Controller('songs')
@ApiTags('songs')
export class SongController {
  constructor(
    private readonly songService: SongService,
    private readonly songWordService: SongWordService,
    private readonly artistService: ArtistService,
    private readonly contributerService: SongContributerService,
  ) {}

  @Get('')
  async findAll(@Query() query: GetSongsQueryParams) {
    const [songs, total] = await this.songService.findAll(query);

    return {
      songs,
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.ceil(total / query.pageSize),
    };
  }

  @Get('albums')
  async findAllAlbums() {
    return this.songService.findAllAlbums();
  }

  @Get('/:songId')
  async findOne(@Param('songId', ParseIntPipe) songId: number) {
    return this.songService.findOne(songId);
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

    const areAllArtistsExists = await this.artistService.checkIfExists(
      createSongDto.contributers.map((contribuer) => contribuer.artistName),
    );

    if (!areAllArtistsExists)
      throw new BadRequestException('Not all artists exists');

    const song = await this.songService.insert(createSongDto);

    const contributers = await this.createContributers(
      createSongDto.contributers,
      song,
    );

    const songWords = this.songWordService.convertLyricsToSongWords(
      createSongDto.lyrics,
      song,
    );

    await this.songWordService.insertMany(songWords);
    return { success: true, song, contributers, songWords };
  }

  async createContributers(basicContributer: addContributer[], song: Song) {
    const contributers = (await this.artistService.changeNamesToIds(
      basicContributer,
    )) as Array<{
      artistId: number;
      type: ContributerType;
    }>;

    const contributersToCreate: Array<createContributerDto> = contributers.map(
      (contributer) => {
        return { ...contributer, song };
      },
    );

    return await this.contributerService.insertMany(contributersToCreate);
  }

  @Post('seed')
  public async seed() {
    const options = {
      apiKey:
        'kN3y5VcTL7u0dpKKaBN61aDjJvGUuQIcv-goEsxzL6FZzQqgG7pfoRspNMaTslL7',
    };

    const arr = new Array(20)
      .fill(0)
      .map((_, i) => Math.floor(Math.random() * 9999999));

    const songs = (
      await Promise.all(
        arr.map(async (songId) => {
          try {
            const songLyrics = await getSongById(songId, options.apiKey);
            const songData = await fetch(
              `https://api.genius.com/songs/${songId}`,
              {
                headers: {
                  Authorization: `Bearer ${options.apiKey}`,
                },
              },
            ).then((res) => res.json());

            return { ...songData, ...songLyrics };
          } catch (error) {
            Logger.warn(`Failed to fetch song id: ${songId}`);
            return null;
          }
        }),
      )
    ).filter((song) => song !== null && !!song?.lyrics);

    Logger.log(`Start seeding ${songs.length} songs`);

    const songsDtos = (
      await Promise.allSettled(
        songs.map(async (songData) => {
          try {
            const artists = [
              ...(songData.response.song?.writer_artists || []).map(
                (artist) => ({
                  ...artist,
                  type: 'writer',
                }),
              ),
              ...(songData.response.song?.producer_artists || []).map(
                (artist) => ({
                  ...artist,
                  type: 'producer',
                }),
              ),
              ...[
                ...(songData.response.song?.primary_artists || []),
                ...(songData.response.song?.featured_artists || []),
              ].map((artist) => ({
                ...artist,
                type: 'singer',
              })),
            ];

            await Promise.all(
              artists.map(async (artist) =>
                this.artistService.insert({
                  name: artist.name,
                  imageUrl: artist.image_url,
                }),
              ),
            ).catch((reason) =>
              Logger.warn(`Seed warn artists insert: ${reason}`),
            );

            return {
              name: songData?.title,
              album: songData.response.song?.album?.name,
              releaseDate: songData.response?.song?.release_date,
              coverUrl: songData.response.song?.song_art_image_thumbnail_url,
              lyrics: songData.lyrics,
              contributers: artists.map((artist) => ({
                type: artist?.type,
                artistName: artist?.name,
              })),
            };
          } catch (error) {
            Logger.error(error);
            throw error;
          }
        }),
      )
    )
      .filter((promise) => promise.status === 'fulfilled')
      .map((promiseResult: PromiseFulfilledResult<any>) => promiseResult?.value)
      .filter(
        (songDTO) => songDTO.name && songDTO.lyrics && songDTO.releaseDate,
      );

    Logger.log(`Start inserting ${songsDtos.length} songs`);

    await Promise.allSettled(
      songsDtos.map(async (songDto) => this.create(songDto)),
    );

    Logger.log(`Seed finished :)`);
  }
}
