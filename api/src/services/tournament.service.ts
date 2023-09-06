import { CreateUserDto } from "../dtos/users.dto";
import HttpException from "../exceptions/HttpException";
import trainerModel from "../models/trainer.model";
import { Trainer } from "../models/trainer.model";
import tournamentModel from "../models/tournament.model";
import pokemonModel from "../models/pokemon.model";
import {Pokemon} from "../models/pokemon.model";
import {Tournament} from "../models/tournament.model";
import {CreateTournamentDto} from "../dtos/tournament.dto";
import axios from "axios";


class TournamentService {
    public trainer = trainerModel;
    public tournament = tournamentModel;
    public pokemon = pokemonModel;

    public async saveTournament(tournamentData: CreateTournamentDto): Promise<Tournament> {
        return await (new this.tournament({
            trainerOne: tournamentData.trainerOneId,
            trainerTwo: tournamentData.trainerTwoId,
            trainerThree: tournamentData.trainerThreeId,
            trainerFour: tournamentData.trainerFourId,
            champ: tournamentData.champId,
        })).save() as unknown as Tournament;
    }
    // Función para crear un entrenador aleatorio con 6 Pokémon
    private async createRandomTrainer() {
        const trainer: Trainer = {
            name: `Trainer ${Math.floor(Math.random() * 72) + 1}`,
            pokemonOne: undefined,
            pokemonTwo: undefined,
            pokemonThree: undefined,
            pokemonFour: undefined,
            pokemonFive: undefined,
            pokemonSix: undefined,
            isChamp: false,
            _id: ""
        }

        const numberNames = ["One", "Two", "Three", "Four", "Five", "Six"];
        for (let i = 0; i < 6; i++) {
            const randomPokemon = await this.getRandomPokemon();
            // trainer[`pokemon${numberNames[i]}`] = randomPokemon;
            switch (i) {
                case 1:
                    trainer.pokemonOne = randomPokemon;                    
                    break;
                case 2:
                    trainer.pokemonTwo = randomPokemon;                    
                    break;
                case 3:
                    trainer.pokemonThree = randomPokemon;                    
                    break;
                case 4:
                    trainer.pokemonFour = randomPokemon;                    
                    break;
                case 5:
                    trainer.pokemonFive = randomPokemon;                    
                    break;
                case 6:
                    trainer.pokemonSix = randomPokemon;                    
                    break;
                default:
                    break;
            }
          }
        return trainer;        
    }

    /**
     * Create 4 random trainers with their 6 random pokemon consuming pokeapi.co and random data
     * @returns 
     */
    private async createRandomTrainers(): Promise<Trainer[]> {
        const trainers: Trainer[] = [];
        for (let i = 0; i < 4; i++) {
        const trainer = await this.createRandomTrainer();
        trainers.push(trainer);
        }
        return trainers;
    }

    /**
     * Create a random pokemon
     * @returns 
     */
    private async getRandomPokemon(): Promise<Pokemon> {
        const randomPokemonId = Math.floor(Math.random() * 150) + 1;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`)
        return response.data;

    }

    public battle(trainer1: Trainer, trainer2: Trainer): Trainer {
        // Battle logic here 
        // Return the winning trainer
        const winner = Math.floor(Math.random() * 2) + 1;
        if(winner === 1){
            return trainer1;
        }
        else{
            return trainer2;
        }
        
    }

    public async startTournament(): Promise<Tournament> {
        //TODO: Create 4 random trainers with their 6 random pokemon consuming pokeapi.co and random data
        //TODO: Create tournament with 4 random trainers
        //TODO: Fight 4 trainers until we get a winner
        //TODO: Save and return Tournament
        //not implemented

        try {

            const tournamentData: CreateTournamentDto = {
                trainerOneId: "",
                trainerTwoId: "",
                trainerThreeId: "",
                trainerFourId: "",
                champId: "",
            };

            const trainers = await this.createRandomTrainers();
            console.log('Tournament Participants:');
            trainers.forEach((trainer, index) => {
              console.log(`Trainer ${index + 1}: ${trainer.name}`);
              switch (index) {
                case 0:
                    tournamentData.trainerOneId = trainer._id;
                    break;
                case 1:
                    tournamentData.trainerTwoId = trainer._id;
                    break;
                case 2:
                    tournamentData.trainerThreeId = trainer._id;
                    break;
                case 3:
                    tournamentData.trainerFourId = trainer._id;
                    break;
                default:
                    break;
              }
            });
        
            while (trainers.length > 1) {
              const nextRoundWinners: Trainer[] = [];
        
              for (let i = 0; i < trainers.length; i += 2) {
                const trainer1 = trainers[i];
                const trainer2 = trainers[i + 1];
        
                const winner = this.battle(trainer1, trainer2);
                nextRoundWinners.push(winner);
              }
        
              trainers.length = 0; // Clear the current trainers array
              trainers.push(...nextRoundWinners); // Move the winners to the next round
            }
        
            const champ = trainers[0];
            tournamentData.champId = champ._id;
            console.log(`Tournament Winner: ${champ.name}`);
        
            return await this.saveTournament(tournamentData);;
          } catch (error) {
            console.error('Error:', error);
            return {
                createdAt: undefined,
                trainerOne: undefined,
                trainerTwo: undefined,
                trainerThree: undefined,
                trainerFour: undefined,
                champ: null,
                _id: ""
            }
          }        
        // throw new HttpException(409, "Not implemented");
    }


}

export default TournamentService;
