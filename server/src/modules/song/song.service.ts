import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  Repository,
  SelectQueryBuilder,
  QueryRunner,
  DeepPartial,
  Connection,
} from 'typeorm';
import { Song } from './song.entity';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import createSongReqDto, { createSongDto } from './song.dto';
import { formatText, getQueryParamList } from 'src/utils';
import { GetSongsQueryParams } from './dtos';
import { SongWordService } from '../songWord/songWord.service';
import { ArtistService } from '../artist/artist.service';
import { SongContributorService } from '../songContributor/songContributor.service';
import { Artist } from '../artist/artist.entity';
import { SongContributor } from '../songContributor/songContributor.entity';
import { SongWord } from '../songWord/songWord.entity';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private readonly songWordService: SongWordService,
    private readonly artistService: ArtistService,
    private readonly contributorService: SongContributorService,
    @InjectConnection() private readonly connection: Connection,
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
      queryBuilder.andWhere('song.album IN (:...albums)', { albums });
    }

    if (artists.length > 0) {
      queryBuilder
        .leftJoinAndSelect('song.contributors', 'song_contributors')
        .leftJoinAndSelect('song_contributors.artist', 'contributorArtist')
        .leftJoinAndSelect('song.artist', 'songArtist')
        .andWhere('contributorArtist.name IN (:...artists)', {
          artists,
        })
        .orWhere('songArtist.name IN (:...artists)', {
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

  async findSongsNames() {
    return this.songRepository.find({ select: { name: true, id: true } });
  }

  async findOne(songId: number): Promise<Song> {
    return this.songRepository.findOne({
      where: { id: songId },
      relations: ['artist'],
    });
  }

  async findByName(songName: string): Promise<Song[]> {
    return this.songRepository.findBy({ name: songName });
  }

  async insert(song: createSongDto): Promise<Song> {
    const newSong = this.songRepository.create(song);

    return this.songRepository.save(newSong);
  }

  async findSongByNameAndContributors({
    name,
    contributors,
  }: createSongReqDto): Promise<Song | null> {
    const songs = await this.songRepository.find({
      where: { name },
      relations: ['contributors', 'contributors.artist'], // Ensure to include relations
    });

    if (songs.length === 0) return null;

    // Iterate over each song to check if contributors match
    for (const song of songs) {
      const match = contributors.every((contributor) =>
        song.contributors.some(
          (existingContributor) =>
            existingContributor.artist.name === contributor.artistName &&
            existingContributor.type === contributor.type,
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

  private async startTransaction(queryRunner: Map<string, QueryRunner>) {
    return Promise.all(
      Array.from(queryRunner.values()).map(async (runner) => {
        console.log('Runner', runner);
        await runner.connect();
        await runner.startTransaction();
      }),
    );
  }

  public async create(createSongDto: createSongReqDto) {
    Logger.debug(`'Trying to create: ${JSON.stringify(createSongDto)}`);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const isAlreadyExists =
      await this.findSongByNameAndContributors(createSongDto);

    //TODO: add transactions
    if (isAlreadyExists)
      throw new BadRequestException('the song already exists');

    Logger.debug(`Trying to upsert artists`);

    try {
      await Promise.all(
        createSongDto.contributors.map(
          async (artist) =>
            await queryRunner.manager.save(Artist, {
              name: artist.artistName,
              imageUrl: '',
            }),
        ),
      );

      const artist = await queryRunner.manager.save(Artist, {
        name: createSongDto?.artistName,
        imageUrl: createSongDto?.artistImageUrl,
      });

      const song = await queryRunner.manager.save(Song, {
        name: createSongDto.name,
        album: createSongDto.album,
        releaseDate: createSongDto.releaseDate,
        coverUrl: createSongDto.coverUrl,
        contributors: createSongDto.contributors,
        artist: artist,
      } as DeepPartial<Song>);

      const contributersToCreate =
        await this.contributorService.createContributerDocs(
          createSongDto.contributors,
          song,
        );

      const contributors = await queryRunner.manager.save(
        SongContributor,
        contributersToCreate,
      );

      const songWords = this.songWordService.convertLyricsToSongWords(
        createSongDto.lyrics,
        song,
      );

      await queryRunner.manager.save(SongWord, songWords);

      await queryRunner.commitTransaction();

      Logger.log(`New song created: ${song?.id}`);

      return { success: true, song, contributors, songWords };
    } catch (error) {
      Logger.error('Rolling back transaction');
      Logger.error(error.toString());
      queryRunner.rollbackTransaction();
      throw error;
    } finally {
      queryRunner.release();
    }
  }

  async getTotalSongs(): Promise<number> {
    return this.songRepository.count();
  }
}
