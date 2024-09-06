import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { WordGroupService } from './wordGroup.service';
import { createNewGroupName } from './wordGroup.dto';

@Controller('wordGroup')
export class WordGroupController {
  constructor(private readonly wordGroupService: WordGroupService) {}
  //TODO: think if we want to support creating an empty wordGroup (and if so, how?)

  @Get('/')
  async findAll() {
    return this.wordGroupService.findAll();
  }

  @Get('/search/:wordGroup')
  async searchWord(@Param('wordGroup') wordGroup: string) {
    return this.wordGroupService.findByGroupName(wordGroup);
  }

  @Post()
  async insertGroup(@Body() newGroupWord: createNewGroupName) {
    return this.wordGroupService.insert(newGroupWord);
  }

  @Delete('/word/:wordGroup/:word')
  async removeWord(
    @Param('wordGroup') wordGroup: string,
    @Param('word') word: string,
  ) {
    const result = await this.wordGroupService.remove(word, wordGroup);
    if (result.affected === 0)
      throw new NotFoundException(
        `Couldn't find word ${word} with the group ${wordGroup}`,
      );
    return { success: true, affected: result.affected };
  }

  @Delete('/group/:group')
  async deleteGroup(@Param('group') group: string) {
    const result = await this.wordGroupService.deleteGroup(group);
    if (result.affected === 0)
      throw new NotFoundException(`Couldn't find group ${group}`);
    return { success: true, affected: result.affected };
  }
}
