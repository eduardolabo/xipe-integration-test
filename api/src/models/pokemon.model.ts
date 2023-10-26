import mongoose from "mongoose";
import {MongoInterface} from "../utils/mongo.interface";

const pokemonSchema = new mongoose.Schema<Pokemon>({
    name: { type: String, required: true },
    types: { type: Array, of: String },
    moves: { type: Array, of: String },
    level: { type: Number, required: true },
});


pokemonSchema.methods.replaceMove= function (move: string, newMove: string) {
    const moves = this.moves;
    const index = moves.indexOf(move);
    if (index !== -1) {
        moves[index] = newMove;
    }
    this.moves = moves;
    return moves
}

export interface Pokemon extends MongoInterface{
    name: string;
    types: string[];
    moves: string[];
    level: number;
    replaceMove(): string[] ;
}

const pokemonModel = mongoose.model<Pokemon & mongoose.Document>("Pokemon", pokemonSchema);

export default pokemonModel;
export {pokemonSchema};
