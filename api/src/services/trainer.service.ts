import { CreateTrainerDto } from '../dtos/trainer.dto';
import HttpException from '../exceptions/HttpException';
import trainerModel, { Trainer } from '../models/trainer.model';
import PokemonService from './pokemon.service';

class TrainerService {
    public trainer = trainerModel;

    public async findAllTrainers(): Promise<Trainer[]> {
        return this.trainer.find();
    }

    public async findTrainerById(trainerId: string): Promise<Trainer> {
        const trainer = await this.trainer.findById(trainerId).populate('pokemonOne').populate('pokemonTwo').populate('pokemonThree').populate('pokemonFour').populate('pokemonFive').populate('pokemonSix');
        if (trainer) return trainer;
        throw new HttpException(409, "You're not trainer");
    }

    public async createTrainer(trainerData: CreateTrainerDto): Promise<Trainer> {
        if((trainerData.pokemonSixId && !trainerData.pokemonFiveId) || (trainerData.pokemonFiveId && !trainerData.pokemonFourId) || (trainerData.pokemonFourId && !trainerData.pokemonThreeId) || (trainerData.pokemonThreeId && !trainerData.pokemonTwoId) || (trainerData.pokemonTwoId && !trainerData.pokemonOneId)){
            throw new HttpException(
                400,
                `You must fill in all pokemon slots in order`
            );
        }
        return await (new this.trainer({
            name: trainerData.name,
            pokemonOne: trainerData.pokemonOneId,
            pokemonTwo: trainerData.pokemonTwoId,
            pokemonThree: trainerData.pokemonThreeId,
            pokemonFour: trainerData.pokemonFourId,
            pokemonFive: trainerData.pokemonFiveId,
            pokemonSix: trainerData.pokemonSixId,
            isChamp: trainerData.isChamp,
        })).save() as unknown as Trainer;
    }

    public async deleteTrainer(trainerId: string): Promise<Trainer> {
        const trainer = await this.trainer.findByIdAndDelete(trainerId);
        if (trainer) return trainer;
        throw new HttpException(409, "You're not trainer");
    }

    public async fightTrainer(trainerOneId: string, trainerTwoId: string): Promise<1|2> {
        const trainerOne = await this.trainer.findById(trainerOneId);
        const trainerTwo = await this.trainer.findById(trainerTwoId);
        const pokemonService = new PokemonService();

        if(!trainerOne || !trainerTwo){
            throw new HttpException(409, "You're not trainer");
        }

        const results= [];
        results.push(await pokemonService.fightPokemon(trainerOne.pokemonOne._id, trainerTwo.pokemonOne._id));
        results.push(await pokemonService.fightPokemon(trainerOne.pokemonTwo._id, trainerTwo.pokemonTwo._id));
        results.push(await pokemonService.fightPokemon(trainerOne.pokemonThree._id, trainerTwo.pokemonThree._id));
        results.push(await pokemonService.fightPokemon(trainerOne.pokemonFour._id, trainerTwo.pokemonFour._id));
        results.push(await pokemonService.fightPokemon(trainerOne.pokemonFive._id, trainerTwo.pokemonFive._id));
        results.push(await pokemonService.fightPokemon(trainerOne.pokemonSix._id, trainerTwo.pokemonSix._id));

        let trainerOneWins = 0;
        let trainerTwoWins = 0;

        for(let i = 0; i < results.length; i++){
            if(results[i] === 1){
                trainerOneWins++;
            }
            else{
                trainerTwoWins++;
            }
        }

        if(trainerOneWins > trainerTwoWins){
            return 1;
        }
        else{
            return 2;
        }
    }
}

export default TrainerService;
