import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SongContributor } from './songContributor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import addContributor, {
  ContributorType,
  createContributorDto,
} from './songContributor.dto';
import { Song } from '../song/song.entity';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class SongContributorService {
  constructor(
    @InjectRepository(SongContributor)
    private songContribuerRepository: Repository<SongContributor>,
    private artistService: ArtistService,
  ) {}

  async findAll(): Promise<SongContributor[]> {
    return this.songContribuerRepository.find();
  }

  async findAllBySongId(songId: number): Promise<SongContributor[]> {
    return this.songContribuerRepository.find({
      where: {
        song: {
          id: songId,
        },
      },
    });
  }

  async insertMany(
    songContributors: Array<createContributorDto>,
  ): Promise<SongContributor[]> {
    const newSongContributors =
      this.songContribuerRepository.create(songContributors);
    return this.songContribuerRepository.save(newSongContributors);
  }

  async createContributors(basicContributor: addContributor[], song: Song) {
    const contributors = (await this.artistService.changeNamesToIds(
      basicContributor,
    )) as Array<{
      artistId: number;
      type: ContributorType;
    }>;

    const contributorsToCreate: Array<createContributorDto> = contributors.map(
      (contributor) => {
        return { ...contributor, song };
      },
    );

    return this.insertMany(contributorsToCreate);
  }
}
