import mongoose from "mongoose";
import {Pokemon} from "./pokemon.model";
import { MongoInterface } from "../../utils/mongo.interface";

const trainerSchema = new mongoose.Schema<Trainer>({
    name: { type: String, required: true },
    pokemonOne: {type: mongoose.Types.ObjectId, ref: "Pokemon"},
    pokemonTwo: {type: mongoose.Types.ObjectId, ref: "Pokemon"},
    pokemonThree: {type: mongoose.Types.ObjectId, ref: "Pokemon"},
    pokemonFour: {type: mongoose.Types.ObjectId, ref: "Pokemon"},
    pokemonFive: {type: mongoose.Types.ObjectId, ref: "Pokemon"},
    pokemonSix: {type: mongoose.Types.ObjectId, ref: "Pokemon"},
    isChamp: { type: Boolean },
});
export interface Trainer extends MongoInterface{
    name: string;
    pokemonOne: Pokemon;
    pokemonTwo: Pokemon;
    pokemonThree: Pokemon;
    pokemonFour: Pokemon;
    pokemonFive: Pokemon;
    pokemonSix: Pokemon;
    isChamp: boolean;
}


const trainerModel = mongoose.model<Trainer & mongoose.Document>("Trainer", trainerSchema);

export default trainerModel;
