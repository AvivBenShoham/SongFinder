import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ContributerType } from '../songContributer/songContribuer.dto';

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

  async addIdsByNames<T extends HasArtistName>(
    array: Array<T>,
  ): Promise<Array<T>> {
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
      return { ...object, artistId: nameToIdHash.get(object.artistName) };
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
