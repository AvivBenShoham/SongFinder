import { Controller, Get } from "@nestjs/common";
import { ArtistService } from "./artist.service";

@Controller('artists')
export class ArtistController {
    constructor(private readonly artistService: ArtistService) {}

    @Get('')
    findAll() {
        return this.artistService.findAll()
    }
}