import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GroupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  groupName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  word: string;
}

export class DeleteGroupDto extends PickType(GroupDto, ['groupName']) {}
