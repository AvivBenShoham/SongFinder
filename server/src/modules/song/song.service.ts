import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  In,
  Repository,
  MoreThanOrEqual,
  SelectQueryBuilder,
  InsertResult,
} from 'typeorm';
import { Song } from './song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import createSongReqDto, { createSongDto } from './song.dto';
import { formatText, getQueryParamList } from 'src/utils';
import { GetSongsQueryParams } from './dtos';
import { SongWordService } from '../songWord/songWord.service';
import { ArtistService } from '../artist/artist.service';
import { SongContributerService } from '../songContributer/songContributer.service';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private readonly songWordService: SongWordService,
    private readonly artistService: ArtistService,
    private readonly contributerService: SongContributerService,
  ) {}

  private buildPaginationQuery(
    query: GetSongsQueryParams,
  ): SelectQueryBuilder<Song> {
    const words = getQueryParamList(query?.words).map(formatText);
    const albums = getQueryParamList(query?.albums);
    const artists = getQueryParamList(query?.artists);

    const queryBuilder = this.songRepository.createQueryBuilder('song');

    if (query.songName) {
      const searchString = `%${query.songName.toLowerCase()}%`;

      queryBuilder.andWhere('LOWER(song.name) LIKE :searchString', {
        searchString,
      });
    }

    if (words.length > 0) {
      queryBuilder
        .innerJoinAndSelect('song.lyrics', 'song_words')
        .andWhere('song_words.word IN (:...words)', { words });
    }

    if (albums.length > 0) {
      queryBuilder.where('song.album IN (:...albums)', { albums });
    }

    if (artists.length > 0) {
      queryBuilder
        .leftJoinAndSelect('song.contributers', 'song_contributers')
        .leftJoinAndSelect('song_contributers.artist', 'contributerArtist')
        .andWhere('contributerArtist.name IN (:...artists)', {
          artists,
        });
    }

    if (query.date) {
      queryBuilder.andWhere('song.release_date >= :releaseDate', {
        releaseDate: query.date,
      });
    }

    queryBuilder.leftJoinAndSelect('song.artist', 'artist');

    if (query.page && query.pageSize) {
      queryBuilder
        .orderBy('song.releaseDate')
        .skip((query.page - 1) * query.pageSize)
        .take(query.pageSize);
    }

    return queryBuilder;
  }

  async findAll(query: GetSongsQueryParams) {
    return this.buildPaginationQuery(query).getManyAndCount();
  }

  async findOne(songId: number): Promise<Song> {
    return this.songRepository.findOneBy({ id: songId });
  }

  async findByName(songName: string): Promise<Song[]> {
    return this.songRepository.findBy({ name: songName });
  }

  async insert(song: createSongDto): Promise<Song> {
    const newSong = this.songRepository.create(song);

    return this.songRepository.save(newSong);
  }

  async findSongByNameAndContributers({
    name,
    contributers,
  }: createSongReqDto): Promise<Song | null> {
    const songs = await this.songRepository.find({
      where: { name },
      relations: ['contributers', 'contributers.artist'], // Ensure to include relations
    });

    if (songs.length === 0) return null;

    // Iterate over each song to check if contributers match
    for (const song of songs) {
      const match = contributers.every((contributer) =>
        song.contributers.some(
          (existingContributer) =>
            existingContributer.artist.name === contributer.artistName &&
            existingContributer.type === contributer.type,
        ),
      );

      if (match) {
        return song; // Return the first matching song
      }
    }

    return null; // No matching song found
  }

  public async findAllAlbums() {
    return this.songRepository
      .createQueryBuilder('song')
      .select('DISTINCT(song.album) album')
      .getRawMany();
  }

  public async create(createSongDto: createSongReqDto) {
    Logger.debug(`'Trying to create: ${JSON.stringify(createSongDto)}`);

    const isAlreadyExists =
      await this.findSongByNameAndContributers(createSongDto);

    //TODO: add transactions
    if (isAlreadyExists)
      throw new BadRequestException('the song already exists');

    const artists = [
      ...createSongDto.contributers.map((artist) => ({
        artistName: artist.artistName,
        imageUrl: '',
      })),
      {
        artistName: createSongDto.artist,
        imageUrl: createSongDto?.artistImageUrl,
      },
    ];

    Logger.debug(`Trying to insert new artists: ${JSON.stringify(artists)}`);

    await Promise.allSettled(
      artists.map(async (artist) =>
        this.artistService.insert({
          name: artist.artistName,
          imageUrl: artist?.imageUrl,
        }),
      ),
    );

    try {
      const artist = await this.artistService.findOneByName(
        createSongDto.artist,
      );

      const song = await this.insert({ ...createSongDto, artist });

      const contributers = await this.contributerService.createContributers(
        createSongDto.contributers,
        song,
      );

      const songWords = this.songWordService.convertLyricsToSongWords(
        createSongDto.lyrics,
        song,
      );

      await this.songWordService.insertMany(songWords);

      Logger.log(`New song created: ${song?.id}`);

      return { success: true, song, contributers, songWords };
    } catch (error) {
      Logger.error(error.toString());

      throw error;
    }
  }
}
