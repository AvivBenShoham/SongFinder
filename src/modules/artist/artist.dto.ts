import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class createArtistDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUrl({}, { message: 'Invalid URL format' })
  @IsString()
  @IsOptional()
  imageUrl: URL;
}
