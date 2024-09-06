import { Body, Controller, Get, Post } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { createArtistDto } from './artist.dto';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get('')
  findAll() {
    return this.artistService.findAll();
  }

  @Post('')
  createArtist(@Body() createArtistDto: createArtistDto) {
    return this.artistService.insert(createArtistDto);
  }
}
