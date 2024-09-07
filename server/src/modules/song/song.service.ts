import { Injectable } from '@nestjs/common';
import { In, Repository, MoreThanOrEqual, SelectQueryBuilder } from 'typeorm';
import { Song } from './song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import createSongReqDto, { createSongDto } from './song.dto';
import { formatText, getQueryParamList } from 'src/utils';
import { GetSongsQueryParams } from './dtos';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  private buildPaginationQuery(
    query: GetSongsQueryParams,
  ): SelectQueryBuilder<Song> {
    const words = getQueryParamList(query?.words).map(formatText);
    const albums = getQueryParamList(query?.albums);
    const artists = getQueryParamList(query?.artists).map(formatText);

    const queryBuilder = this.songRepository.createQueryBuilder('song');

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
        .innerJoinAndSelect('song.contributers', 'song_contributers')
        .innerJoinAndSelect('song_contributers.artist', 'artists')
        .andWhere('artists.lowercasedName IN (:...artists)', {
          artists,
        });
    }

    if (query.date) {
      queryBuilder.andWhere('song.release_date >= :releaseDate', {
        releaseDate: query.date,
      });
    }

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
