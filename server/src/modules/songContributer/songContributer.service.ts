import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SongContributer } from './songContributer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createContributerDto } from './songContribuer.dto';

@Injectable()
export class SongContributerService {
  constructor(
    @InjectRepository(SongContributer)
    private songContribuerRepository: Repository<SongContributer>,
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
}
