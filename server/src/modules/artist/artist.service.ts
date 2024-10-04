import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createArtistDto } from './artist.dto';
import { GetArtistsQueryParams } from './dtos';

interface HasArtistName {
  artistName: string;
}

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async insert(createArtistDto: createArtistDto) {
    return this.artistRepository
      .createQueryBuilder('artist')
      .insert()
      .into(Artist)
      .values(createArtistDto)
      .orIgnore()
      .execute();
  }

  async findAll(query: GetArtistsQueryParams): Promise<Artist[]> {
    const queryBuilder = this.artistRepository.createQueryBuilder('artist');

    return queryBuilder.getMany();
  }

  async findByName(name: string): Promise<Artist[]> {
    return this.artistRepository.findBy({ name });
  }

  async findOneByName(name: string): Promise<Artist> {
    return this.artistRepository.findOneBy({ name });
  }

  async changeNamesToIds<T extends HasArtistName>(
    array: Array<T>,
  ): Promise<Array<T & { artistId: number }>> {
    const artists = await this.artistRepository.find({
      where: {
        name: In(array.map((object) => object.artistName)),
      },
    });

    const nameToIdHash = new Map();

    artists.map(({ name, artistId }) => nameToIdHash.set(name, artistId));

    return array.map((object) => {
      const withAddId = {
        ...object,
        artistId: nameToIdHash.get(object.artistName),
      };

      delete withAddId.artistName;

      return withAddId;
    });
  }

  // works according to the assumption that each artists has a unique name
  async checkIfExists(...names: string[]): Promise<boolean> {
    const artists = await this.artistRepository.find({
      where: {
        name: In(names),
      },
    });

    const artistsNames = artists.map((artist) => artist.name);

    return names.every((name) => artistsNames.includes(name));
  }

  async getArtistWithMostSongs(
    page: number,
    pageSize: number,
  ): Promise<
    {
      artistName: string;
      artistImageUrl: URL;
      count: number;
    }[]
  > {
    const result = await this.artistRepository
      .createQueryBuilder('artist')
      .leftJoinAndSelect('artist.songs', 'song')
      .select('artist.name', 'artistName')
      .addSelect('artist.imageUrl', 'artistImageUrl')
      .addSelect('COUNT(DISTINCT song.id)', 'count')
      .groupBy('artist.name, artist.imageUrl')
      .orderBy('COUNT(DISTINCT song.id)', 'DESC')
      .addOrderBy('artist.name', 'ASC')
      .offset(pageSize * (page - 1))
      .limit(pageSize)
      .getRawMany();

    return result;
  }

  async getTotalArtists(): Promise<number> {
    return this.artistRepository.count();
  }
}
