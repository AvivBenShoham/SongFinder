import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WordGroupService } from './wordGroup.service';
import { WordGroupController } from './wordGroup.controller';
import { WordGroup } from './wordGroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordGroup])],
  controllers: [WordGroupController],
  providers: [WordGroupService],
  exports: [WordGroupService],
})
export class WordGroupModule {}
