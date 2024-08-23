import { Controller, Get } from "@nestjs/common";
import { SongService } from "./song.service";

@Controller('songs')
export class SongController {
    constructor(private readonly songService: SongService) {}

    @Get('')
    findAll() {
        return this.songService.findByName
    }
}