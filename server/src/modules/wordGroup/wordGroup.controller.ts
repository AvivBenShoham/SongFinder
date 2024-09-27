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
import { DeleteGroupDto, GroupDto } from './wordGroup.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('groups')
@ApiTags('Groups')
export class WordGroupController {
  constructor(private readonly wordGroupService: WordGroupService) {}

  @Get('/')
  async findAll() {
    return this.wordGroupService.findAll();
  }

  @Get('/names')
  async findGroupNames() {
    return this.wordGroupService.findGroupNames();
  }

  @Get('/search/:wordGroup')
  async searchWord(@Param('wordGroup') wordGroup: string) {
    return this.wordGroupService.findByGroupName(wordGroup);
  }

  @Post()
  async insertGroup(@Body() newGroupWord: GroupDto) {
    return this.wordGroupService.insert(newGroupWord);
  }

  @Delete('/word')
  async removeWord(@Body() wordGroup: GroupDto) {
    return this.wordGroupService.remove(wordGroup);
  }

  @Delete('')
  async deleteGroup(@Body() deleteGroupDto: DeleteGroupDto) {
    return this.wordGroupService.deleteGroup(deleteGroupDto.groupName);
  }
}
