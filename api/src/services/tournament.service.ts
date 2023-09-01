import { CreateUserDto } from "../dtos/users.dto";
import HttpException from "../exceptions/HttpException";
import trainerModel from "../models/trainer.model";
import tournamentModel from "../models/tournament.model";
import pokemonModel from "../models/pokemon.model";
import {Tournament} from "../models/tournament.model";
import {CreateTournamentDto} from "../dtos/tournament.dto";


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
    public async startTournament(): Promise<Tournament> {
        
        const ps = new PokemonService()
        const ts = new TrainerService()


        //TODO: Create 4 random trainers with their 6 random pokemon consuming pokeapi.co and random data
        const arrayTrainers: Trainer[] = []
        const arrayPokemons: Pokemon[] = []

        for (let index = 0; index < 4; index++) {
            let r: any = []

            for (let index2 = 0; index2 < 6; index2++){
                r.push( Math.floor( Math.random() * 150 ) ) 
                const aux: CreatePokemonDto = await axios.get( `${ endponit }/${ r[index2] }` )
                const p: Pokemon = await ps.createPokemon( aux )
                arrayPokemons.push( p )
            }

            const auxTT :CreateTrainerDto = {
                name: `trainer ${ index }`,
                pokemonOneId:   arrayPokemons[0]._id, 
                pokemonTwoId:   arrayPokemons[1]._id, 
                pokemonThreeId: arrayPokemons[2]._id, 
                pokemonFourId:  arrayPokemons[3]._id, 
                pokemonFiveId:  arrayPokemons[4]._id, 
                pokemonSixId:   arrayPokemons[5]._id, 
                isChamp: false
            }
            
            const tAux: Trainer = await ts.createTrainer( auxTT ) 
            arrayTrainers.push( tAux )
        }
        

        //TODO: Create tournament with 4 random trainers
        const toreoWawa: CreateTournamentDto = {
            trainerOneId:   arrayTrainers[0]._id,
            trainerTwoId:   arrayTrainers[1]._id,
            trainerThreeId: arrayTrainers[2]._id,
            trainerFourId:  arrayTrainers[3]._id,
            champId: ""
        }

        //TODO: Fight 4 trainers until we get a winner
        let ganador;
        let trainerAux: Trainer;

        for (let i = 1; i < arrayTrainers.length; i++) {
            for (let j = 0; j < arrayTrainers.length - i; j++) {
                ganador = await ts.fightTrainer( arrayTrainers[i]._id, arrayTrainers[j]._id, )
                if ( ganador === 1 ) {
                    trainerAux = arrayTrainers[i];
                    arrayTrainers[i] = arrayTrainers[j];
                    arrayTrainers[j] = trainerAux
                }else{
                    continue;
                }
            }
        }

        toreoWawa.champId = arrayTrainers[3]._id

        //TODO: Save and return Tournament
        const torneo : Tournament = await this.saveTournament( toreoWawa )
        return torneo;

        //not implemented
        // throw new HttpException(409, "Not implemented");
    }

}

export default TournamentService;
