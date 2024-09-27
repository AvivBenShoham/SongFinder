import {
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
import { getSongById } from 'genius-lyrics-api';
import { GetSongsQueryParams } from './dtos';

@Controller('songs')
@ApiTags('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

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

  @Get('names')
  async findSongsNames() {
    return this.songService.findSongsNames();
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
    return this.songService.create(createSongDto);
  }

  @Post('seed')
  public async seed() {
    const options = {
      apiKey:
        'kN3y5VcTL7u0dpKKaBN61aDjJvGUuQIcv-goEsxzL6FZzQqgG7pfoRspNMaTslL7',
    };

    const searchTerms = [
      'Kendrick Lamar',
      'Sia',
      'The Weeknd',
      'Anyma',
      'Beyonce',
      'Jungle',
      'Drake',
      'Bruno Mars',
      'Fred again',
      'Kanye West',
      'SZA',
      'Doja Cat',
      'Adele',
      'Tame Impala',
      'Taylor Swift',
      'ALOK',
      'Tyler, The Creator',
      'JAY-Z',
      'J. Cole',
      'Maroon 5',
      'Billie Eilish',
      'Khalid',
      'Milky Chance',
    ];

    const fetchedSongs = (
      await Promise.allSettled(
        searchTerms.map(async (searchTerm) => {
          Logger.debug(`Trying to seed: ${searchTerm}`);

          const hits = await fetch(
            `https://api.genius.com/search?q=${searchTerm}`,
            {
              headers: {
                Authorization: `Bearer ${options.apiKey}`,
              },
            },
          )
            .then((res) => res.json())
            .then((res) => res.response.hits.map((hit) => hit.result));

          return (
            await Promise.allSettled(
              hits.map(async (songHit) => {
                const songLyrics = await getSongById(
                  songHit.id,
                  options.apiKey,
                );

                Logger.debug(
                  `Search of ${searchTerm} got lyrics of song: ${songHit.id}`,
                );

                return { ...songLyrics, ...songHit };
              }),
            )
          )
            .filter((promise) => promise.status === 'fulfilled')
            .map(
              (promiseResult: PromiseFulfilledResult<any>) =>
                promiseResult?.value,
            );
        }),
      )
    )
      .filter((promise) => promise.status === 'fulfilled')
      .map((promiseResult: PromiseFulfilledResult<any>) => promiseResult?.value)
      .flat();

    const songs = fetchedSongs
      .map((songData) => {
        const contributors = [
          ...(songData?.writer_artists || []).map((artist) => ({
            artistName: artist?.name,
            type: 'writer',
          })),
          ...(songData?.producer_artists || []).map((artist) => ({
            artistName: artist?.name,
            type: 'producer',
          })),
          ...[
            ...(songData?.featured_artists || []),
            ...(songData?.primary_artists || []),
          ].map((artist) => ({
            artistName: artist?.name,
            type: 'singer',
          })),
        ];

        return {
          name: songData?.title,
          artist: songData?.primary_artist?.name,
          artistImageUrl: songData?.primary_artist?.image_url,
          album: songData?.album?.name || songData?.title,
          releaseDate: songData?.release_date_for_display,
          coverUrl: songData?.song_art_image_thumbnail_url,
          lyrics: songData.lyrics,
          contributors,
        };
      })
      .filter((song) => song !== null && !!song?.lyrics);

    Logger.log(`Start seeding ${songs.length} songs`);

    await Promise.allSettled(
      songs.map((song) => this.songService.create(song)),
    );

    Logger.log(`Seed finished :)`);
  }
}
