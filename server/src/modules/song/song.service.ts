import { Injectable } from '@nestjs/common';
import { In, Repository, MoreThanOrEqual, SelectQueryBuilder } from 'typeorm';
import { Song } from './song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import createSongReqDto, { createSongDto } from './song.dto';
import { GetSongsQueryParams } from './song.controller';
import { formatText } from 'src/utils';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  private buildPaginationQuery(
    query: GetSongsQueryParams,
  ): SelectQueryBuilder<Song> {
    const getQueryParamList = (key: string) =>
      query[key]
        ? typeof query[key] === 'string'
          ? [query[key]]
          : query[key]
        : [];

    const words = getQueryParamList('words').map(formatText);
    const albums = getQueryParamList('albums');
    const artists = getQueryParamList('artists').map(formatText);

    let baseQuery = this.songRepository.createQueryBuilder('song');

    if (words.length > 0) {
      baseQuery = baseQuery
        .innerJoinAndSelect('song.lyrics', 'song_words')
        .andWhere('song_words.word IN (:...words)', { words });
    }

    if (albums.length > 0) {
      baseQuery = baseQuery.where('song.album IN (:...albums)', { albums });
    }

    if (artists.length > 0) {
      baseQuery = baseQuery
        .innerJoinAndSelect('song.contributers', 'song_contributers')
        .innerJoinAndSelect('song_contributers.artist', 'artists')
        .andWhere('artists.lowercasedName IN (:...artists)', {
          artists,
        });
    }

    if (query.date) {
      baseQuery = baseQuery.andWhere('song.release_date >= :releaseDate', {
        releaseDate: query.date,
      });
    }

    if (query.page && query.pageSize) {
      const page = Number(query.page);
      const pageSize = Number(query.pageSize);

      baseQuery = baseQuery
        .orderBy('song.releaseDate')
        .skip((page - 1) * pageSize)
        .take(pageSize);
    }

    return baseQuery;
  }

  async findAll(query: GetSongsQueryParams) {
    return this.buildPaginationQuery(query).getManyAndCount();
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
            existingContributer.artist.lowercasedName ===
              formatText(contributer.artistName) &&
            existingContributer.type === contributer.type,
        ),
      );

      if (match) {
        return song; // Return the first matching song
      }
    }

    return null; // No matching song found
  }
}
