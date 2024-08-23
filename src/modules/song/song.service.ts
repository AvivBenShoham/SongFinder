import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createSongDto } from './song.dto';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async findAll(): Promise<Song[]> {
    return this.songRepository.find();
  }

  async findByName(songName: string): Promise<Song[]> {
    return this.songRepository.findBy({ name: songName });
  }

  async insert(song: createSongDto): Promise<Song> {
    return this.songRepository.save(song);
  }
}
