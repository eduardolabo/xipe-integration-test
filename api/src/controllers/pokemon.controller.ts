import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Request,
    Route,
    Security,
    Tags,
} from 'tsoa';

import { CreatePokemonDto } from '../dtos/pokemon.dto';
import { CreateTrainerDto } from '../dtos/trainer.dto';
import PokemonService from '../services/pokemon.service';
import TrainerService from '../services/trainer.service';
import { Permissions } from '../utils/permissions.utils';

@Route("pokemon")
@Tags("Pokemon")
export class PokemonController extends Controller {
    public pokemonService = new PokemonService();
    public trainerService = new TrainerService();

    @Get("")
    @Security("jwt", [Permissions.USER_READ])
    public async getPokemons(@Request() request: any) {
        return await this.pokemonService.findAllPokemons();
    }

    @Get("/{pokemonId}")
    @Security("jwt", [Permissions.USER_READ])
    public async getPokemon(@Request() request: any, @Path('pokemonId') pokemonId: string) {
        return await this.pokemonService.findPokemonById(pokemonId);
    }

    @Post("")
    @Security("jwt", [Permissions.USER_READ])
    public async createPokemon(@Request() request: any, @Body() pokemonData: CreatePokemonDto) {
        return await this.pokemonService.createPokemon(pokemonData);
    }

    @Get("/trainer/{trainerId}")
    @Security("jwt", [Permissions.USER_READ])
    public async getTrainer(@Request() request: any, @Path('trainerId') trainerId: string) {
        console.log("getTrainerById");
        return await this.trainerService.findTrainerById(trainerId);
    }

    @Post("/trainer")
    @Security("jwt", [Permissions.USER_READ])
    public async createTrainer(@Request() request: any, @Body() trainerData: CreateTrainerDto) {
        console.log("createTrainer");
        return await this.trainerService.createTrainer(trainerData);
    }
}
