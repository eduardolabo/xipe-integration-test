import {
    Controller,
    Get,
    Request,
    Route,
    Tags,
} from 'tsoa';

import PokemonService from '../services/pokemon.service';
import TournamentService from '../services/tournament.service';
import TrainerService from '../services/trainer.service';

@Route("tournament")
@Tags("Tournament")
export class TournamentController extends Controller {
    public pokemonService = new PokemonService();
    public trainerService = new TrainerService();
    public tournamentService = new TournamentService(this.pokemonService, this.trainerService);

    @Get("")
    public async getTournament(@Request() request: any) {
        return await this.tournamentService.startTournament();
    }
}
