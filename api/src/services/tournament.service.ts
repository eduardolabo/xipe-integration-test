import trainerModel from '../models/trainer.model';
import { Trainer } from '../models/trainer.model';
import tournamentModel from '../models/tournament.model';
import pokemonModel from '../models/pokemon.model';
import { Pokemon } from '../models/pokemon.model';
import TrainerService from '../services/trainer.service';
import { Tournament } from '../models/tournament.model';
import { CreateTournamentDto } from '../dtos/tournament.dto';
import { CreateTrainerDto } from '../dtos/trainer.dto';
import axios from 'axios';
import { CreatePokemonDto } from '../dtos/pokemon.dto';

class TournamentService {
  private trainer = trainerModel;
  private tournament = tournamentModel;
  private pokemon = pokemonModel;

  constructor(
    private readonly trainerService = new TrainerService(),
    private readonly pokeapiUrl = 'https://pokeapi.co/api/v2'
  ) { }

  public async saveTournament(tournamentData: CreateTournamentDto): Promise<Tournament> {
    return (await new this.tournament({
      trainerOne: tournamentData.trainerOneId,
      trainerTwo: tournamentData.trainerTwoId,
      trainerThree: tournamentData.trainerThreeId,
      trainerFour: tournamentData.trainerFourId,
      champ: tournamentData.champId,
    }).save()) as unknown as Tournament;
  }

  private mapTypes(types: { type: { name: string } }[]): string[] {
    return types.map((x) => x.type.name);
  }

  private mapMoves(moves: { move: { name: string } }[]): string[] {
    return moves.map((x) => x.move.name);
  }

  private async getRandomPokemon(): Promise<CreatePokemonDto> {
    const randomPokemonId = Math.floor(Math.random() * 150) + 1;
    const response = await axios.get(`${this.pokeapiUrl}/pokemon/${randomPokemonId}`);
    const { name, moves, types, base_experience: level } = response.data;

    const pokemonData: CreatePokemonDto = {
      name,
      types: this.mapTypes(types),
      moves: this.mapMoves(moves),
      level,
    };

    return pokemonData;
  }

  /**
   * Create a random pokemon
   * @returns
   */
  private async createRandomPokemon(): Promise<Pokemon> {
    const randomPokemon = await this.getRandomPokemon();
    const pokemon = await this.pokemon.findOne({ name: randomPokemon.name });
    if (!pokemon) {
      return await this.pokemon.create(randomPokemon);
    }
    return pokemon;
  }

  /**
   * Create a random trainer with 6 random pokemons
   * @returns
   */
  private async createOneRandomTrainer(): Promise<Trainer> {
    const trainerName = `Trainer #${Math.floor(Math.random() * 72) + 1}`;
    // check if already exist the trainer
    let trainer = await this.trainer.findOne({ name: trainerName });
    if (!trainer) {
      const pokemons = await Promise.all(
        Array.from({ length: 6 }, () => this.createRandomPokemon())
      );
      const trainerData: CreateTrainerDto = {
        name: trainerName,
        pokemonOneId: pokemons[0]._id,
        pokemonTwoId: pokemons[1]._id,
        pokemonThreeId: pokemons[2]._id,
        pokemonFourId: pokemons[3]._id,
        pokemonFiveId: pokemons[4]._id,
        pokemonSixId: pokemons[5]._id,
        isChamp: false,
      };
      return await this.trainerService.createTrainer(trainerData);
    }
    return trainer;
  }

  /**
   * Create random trainers with their 6 random pokemon consuming pokeapi.co and random data
   * @param count
   * @returns
   */
  private async createManyRandomTrainers(count: number): Promise<Trainer[]> {
    return Promise.all(Array.from({ length: count }, () => this.createOneRandomTrainer()));
  }

  private async resolveBattle(trainers: Trainer[]): Promise<Trainer> {
    while (trainers.length > 1) {
      const nextRoundWinners: Trainer[] = [];

      for (let i = 0; i < trainers.length; i += 2) {
        const [trainer1, trainer2] = trainers.slice(i, i + 2);
        const winner = await this.trainerService.fightTrainer(trainer1._id, trainer2._id);
        nextRoundWinners.push(winner === 1 ? trainer1 : trainer2);
      }

      trainers.length = 0; // Clear the current trainers array
      trainers.push(...nextRoundWinners); // Move the winners to the next round
    }

    return trainers[0];
  }

  public async startTournament(): Promise<Tournament> {
    //TODO: Create 4 random trainers with their 6 random pokemon consuming pokeapi.co and random data
    //TODO: Create tournament with 4 random trainers
    //TODO: Fight 4 trainers until we get a winner
    //TODO: Save and return Tournament
    //not implemented
    try {
      const trainers = await this.createManyRandomTrainers(4);
      const tournamentData: CreateTournamentDto = {
        trainerOneId: trainers[0]._id,
        trainerTwoId: trainers[1]._id,
        trainerThreeId: trainers[2]._id,
        trainerFourId: trainers[3]._id,
        champId: '',
      };

      console.log('Tournament Participants:');
      trainers.forEach((trainer, index) => {
        console.log(`${index + 1}: ${trainer.name}`);
      });
      
      const champ = await this.resolveBattle(trainers);
      tournamentData.champId = champ._id;
      
      console.log(`Tournament Winner: ${champ.name}`);

      return this.saveTournament(tournamentData);
    } catch (error) {
      console.error('Error starting the tournament:', error);
      throw new Error(error);
    }
  }
}

export default TournamentService;
