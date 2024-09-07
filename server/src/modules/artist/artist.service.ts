import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createArtistDto } from './artist.dto';
import { formatText } from 'src/utils';

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
    const exists = await this.findByName(createArtistDto.name);

    if (exists.length > 0) {
      return;
    }

    const newArtist = this.artistRepository.create(createArtistDto);
    return this.artistRepository.save(newArtist);
  }

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
        lowercasedName: In(
          array.map((object) => formatText(object.artistName)),
        ),
      },
    });

    const nameToIdHash = new Map();

    artists.map(({ lowercasedName, artistId }) =>
      nameToIdHash.set(lowercasedName, artistId),
    );

    return array.map((object) => {
      const withAddId = {
        ...object,
        artistId: nameToIdHash.get(formatText(object.artistName)),
      };

      delete withAddId.artistName;

      return withAddId;
    });
  }

  // works according to the assumption that each artists has a unique name
  async checkIfExists(names: string[]): Promise<boolean> {
    const lowerCasedNames = names.map(formatText);

    const artists = await this.artistRepository.find({
      where: {
        lowercasedName: In(lowerCasedNames),
      },
    });

    const artistsLowerCasedNames = artists.map(
      (artist) => artist.lowercasedName,
    );

    return lowerCasedNames.every((name) =>
      artistsLowerCasedNames.includes(name),
    );
  }
}
