import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SongContributer } from './songContributer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import addContributer, {
  ContributerType,
  createContributerDto,
} from './songContribuer.dto';
import { Song } from '../song/song.entity';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class SongContributerService {
  constructor(
    @InjectRepository(SongContributer)
    private songContribuerRepository: Repository<SongContributer>,
    private artistService: ArtistService,
  ) {}

  async findAll(): Promise<SongContributer[]> {
    return this.songContribuerRepository.find();
  }

  async findAllBySongId(songId: number): Promise<SongContributer[]> {
    return this.songContribuerRepository.find({
      where: {
        song: {
          id: songId,
        },
      },
    });
  }

  async insertMany(
    songContributers: Array<createContributerDto>,
  ): Promise<SongContributer[]> {
    const newSongContributers =
      this.songContribuerRepository.create(songContributers);
    return this.songContribuerRepository.save(newSongContributers);
  }

  async createContributers(basicContributer: addContributer[], song: Song) {
    const contributers = (await this.artistService.changeNamesToIds(
      basicContributer,
    )) as Array<{
      artistId: number;
      type: ContributerType;
    }>;

    const contributersToCreate: Array<createContributerDto> = contributers.map(
      (contributer) => {
        return { ...contributer, song };
      },
    );

    return this.insertMany(contributersToCreate);
  }
}
