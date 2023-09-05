import { CreatePokemonDto } from '../dtos/pokemon.dto';
import { CreateTournamentDto } from '../dtos/tournament.dto';
import { CreateTrainerDto } from '../dtos/trainer.dto';
import { PokemonApiResponse } from '../interfaces/api';
import pokemonModel, { Pokemon } from '../models/pokemon.model';
import tournamentModel, { Tournament } from '../models/tournament.model';
import trainerModel, { Trainer } from '../models/trainer.model';
import { generateName } from '../utils/names.generator';
import { random } from '../utils/randomizer';
import ApiService from './api.service';
import PokemonService from './pokemon.service';
import TrainerService from './trainer.service';

class TournamentService {
    public pokemon = pokemonModel;
    public trainer = trainerModel;
    public tournament = tournamentModel;

    // public apiService = new ApiService();
    // public pokemonService = new PokemonService();
    // public trainerService = new TrainerService();
    // public tournamentService = new TournamentService();

    private apiService: ApiService;
    // public pokemonService: PokemonService;
    // public trainerService: TrainerService;

    constructor(
        private pokemonService: PokemonService, 
        private trainerService: TrainerService
    ) {
        this.apiService = new ApiService();
    }

    public async saveTournament(tournamentData: CreateTournamentDto): Promise<Tournament> {
        return await (new this.tournament({
            trainerOne: tournamentData.trainerOneId,
            trainerTwo: tournamentData.trainerTwoId,
            trainerThree: tournamentData.trainerThreeId,
            trainerFour: tournamentData.trainerFourId,
            champ: tournamentData.champId,
        })).save() as unknown as Tournament;
    }

    public async startTournament(): Promise<Tournament> {
        // Create 4 random trainers with their 6 random pokemon consuming pokeapi.co and random data
        const trainerOneId = await this.getRandomTrainerId();
        const trainerTwoId = await this.getRandomTrainerId();
        const trainerThreeId = await this.getRandomTrainerId();
        const trainerFourId = await this.getRandomTrainerId();

        // Create tournament with 4 random trainers
        let champId: string | null = null;
        
        // Fight 4 trainers until we get a winner
        const finisherOneId = await this.trainerService.fightTrainer(trainerOneId, trainerTwoId) === 1 
            ? trainerOneId : trainerTwoId; 

        const finisherTwoId = await this.trainerService.fightTrainer(trainerThreeId, trainerFourId) === 1 
            ? trainerThreeId : trainerFourId;
            
        // Fight 2 winners until we get a champ
        champId = await this.trainerService.fightTrainer(finisherOneId, finisherTwoId) === 1 
            ? finisherOneId : finisherTwoId;

        // Save and return Tournament
        const tournamentData: CreateTournamentDto = {
            trainerOneId,
            trainerTwoId,
            trainerThreeId,
            trainerFourId,
            champId,
        };

        return await this.saveTournament(tournamentData);
    }

    private async getRandomTrainerId(): Promise<string> {
        const trainerName = generateName();

        // Create trainer if it doesn't exist
        let trainer = await this.trainer.findOne<Trainer>({name: trainerName});
        if (!trainer) {
            const trainerData: CreateTrainerDto = {
                name: trainerName,
                pokemonOneId: await this.getRandomPokemonId(),
                pokemonTwoId: await this.getRandomPokemonId(),
                pokemonThreeId: await this.getRandomPokemonId(),
                pokemonFourId: await this.getRandomPokemonId(),
                pokemonFiveId: await this.getRandomPokemonId(),
                pokemonSixId: await this.getRandomPokemonId(),
                isChamp: false,
            };
            trainer = await this.trainerService.createTrainer(trainerData);
        }

        return trainer._id;
    }

    private async getRandomPokemonId(): Promise<string> {
        const randomPokemonId = random(1, 150).toString();
        const response: PokemonApiResponse = await this.apiService.getPokemon(randomPokemonId);

        // Create pokemon if it doesn't exist
        let pokemon = await this.pokemon.findOne<Pokemon>({name: response.name});
        if (!pokemon) {
            const randomLevel = random(1, 100);
            const pokemonData: CreatePokemonDto = {
                name: response.name,
                types: response.types.slice(0, 2).map(type => type.type.name),
                moves: response.moves.slice(0, 4).map(move => move.move.name),
                level: randomLevel,
            }
            pokemon = await this.pokemonService.createPokemon(pokemonData);
        }

        return pokemon._id;
    }
}

export default TournamentService;
