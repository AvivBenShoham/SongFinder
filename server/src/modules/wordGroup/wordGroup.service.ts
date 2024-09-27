import { Injectable } from '@nestjs/common';
import { DeleteResult, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WordGroup } from './wordGroup.entity';
import { formatText } from 'src/utils';
import { DeleteGroupDto, GroupDto } from './wordGroup.dto';

@Injectable()
export class WordGroupService {
  constructor(
    @InjectRepository(WordGroup)
    private wordGroupRepository: Repository<WordGroup>,
  ) {}

  async findAll(): Promise<WordGroup[]> {
    return this.wordGroupRepository
      .createQueryBuilder('group')
      .select('group.groupName', 'groupName')
      .addSelect('array_agg(group.word)', 'words')
      .groupBy('group.groupName')
      .getRawMany();
  }

  async findGroupNames() {
    return this.wordGroupRepository
      .createQueryBuilder('group')
      .select('DISTINCT group.groupName', 'groupName')
      .getRawMany();
  }

  async findByGroupName(...groupNames: string[]): Promise<WordGroup[]> {
    return this.wordGroupRepository.findBy({ groupName: In(groupNames) });
  }

  async insert(group: GroupDto): Promise<WordGroup> {
    const newGroup = this.wordGroupRepository.create({
      groupName: group.groupName,
      word: formatText(group.word),
    });

    return this.wordGroupRepository.save(newGroup);
  }

  async remove(group: DeleteGroupDto): Promise<DeleteResult> {
    return this.wordGroupRepository.delete(group);
  }

  async deleteGroup(groupName: string): Promise<DeleteResult> {
    return this.wordGroupRepository.delete({ groupName });
  }
}
