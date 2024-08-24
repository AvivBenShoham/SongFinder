import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WordGroup } from './wordGroup.entity';

@Injectable()
export class WordGroupService {
  constructor(
    @InjectRepository(WordGroup)
    private wordGroupRepository: Repository<WordGroup>,
  ) {}

  async findAll(): Promise<WordGroup[]> {
    return this.wordGroupRepository.find();
  }

  async findByGroupName(groupName: string): Promise<WordGroup[]> {
    return this.wordGroupRepository.findBy({ groupName });
  }

  // only for internal backend usage
  async insert(songWord: WordGroup): Promise<WordGroup> {
    const newSongWord = this.wordGroupRepository.create(songWord);
    return this.wordGroupRepository.save(newSongWord);
  }

  async remove(word: string, groupName: string): Promise<DeleteResult> {
    return this.wordGroupRepository.delete({ word, groupName });
  }

  async deleteGroup(groupName: string): Promise<DeleteResult> {
    return this.wordGroupRepository.delete({ groupName });
  }
}
