import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class createNewGroupName {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  groupName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  word: string;
}
