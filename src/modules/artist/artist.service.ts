import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { InjectRepository } from '@nestjs/typeorm';

interface HasArtistName {
  artistName: string;
}

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async findByName(name: string): Promise<Artist[]> {
    return this.artistRepository.findBy({ name });
  }

  async changeNamesToIds<T extends HasArtistName>(
    array: Array<T>,
  ): Promise<Array<T & { artistId: number }>> {
    const artists = await this.artistRepository.find({
      where: {
        lowercasedName: In(array.map((object) => object.artistName)),
      },
    });

    const nameToIdHash = new Map();
    artists.map(({ lowercasedName, artistId }) =>
      nameToIdHash.set(lowercasedName, artistId),
    );

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
  async checkIfExists(names: string[]): Promise<boolean> {
    const artists = await this.artistRepository.find({
      where: {
        lowercasedName: In(names),
      },
    });

    return artists.length === names.length;
  }
}
