import HttpException from "../exceptions/HttpException";
import pokemonModel from "../models/pokemon.model";
import {Pokemon} from "../models/pokemon.model";
import {CreatePokemonDto} from "../dtos/pokemon.dto";

class PokemonService {
    public pokemon = pokemonModel;

    public async findAllPokemons(): Promise<Pokemon[]> {
        return this.pokemon.find();
    }

    public async findPokemonById(pokemonId: string): Promise<Pokemon> {
        const pokemon = await this.pokemon.findById(pokemonId);
        if (pokemon) return pokemon;
        throw new HttpException(409, "You're not pokemon");
    }

    public async createPokemon(pokemonData: CreatePokemonDto): Promise<Pokemon> {
        if(pokemonData.moves.length > 4){
            throw new HttpException(
                400,
                `Pokemon can only have 4 moves`
            );
        }
        if(pokemonData.types.length > 2){
            throw new HttpException(
                400,
                `Pokemon can only have 2 types`
            );
        }
        return await this.pokemon.create(pokemonData);
    }

    public async deletePokemon(pokemonId: string): Promise<Pokemon> {
        const pokemon = await this.pokemon.findOneAndDelete({id: pokemonId});
        if (pokemon) return pokemon;
        throw new HttpException(409, "You're not pokemon");
    }

    public async fightPokemon(pokemonOneId: string, pokemonTwoId: string): Promise<number> {
        const pokemonOne= await this.pokemon.findById(pokemonOneId);
        const pokemonTwo= await this.pokemon.findById(pokemonTwoId);
        if(!pokemonOne || !pokemonTwo){
            throw new HttpException(409, "You're not pokemon");
        }
        //get a random winner
        const winner = Math.floor(Math.random() * 2) + 1;
        if(winner === 1){
            return 1;
        }
        else{
            return 2;
        }
    }

}

export default PokemonService;
