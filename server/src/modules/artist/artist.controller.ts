import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { createArtistDto } from './artist.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetArtistsQueryParams } from './dtos';

@Controller('artists')
@ApiTags('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get('')
  findAll(@Query() query: GetArtistsQueryParams) {
    return this.artistService.findAll(query);
  }

  @Post('')
  createArtist(@Body() createArtistDto: createArtistDto) {
    return this.artistService.insert(createArtistDto);
  }
}
