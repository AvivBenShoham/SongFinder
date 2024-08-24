import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import createSongReqDto, { createSongDto } from './song.dto';

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
              contributer.artistName.toLowerCase() &&
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
