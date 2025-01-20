import mongoose from "mongoose";
import {MongoInterface} from "../../utils/mongo.interface";
import {Trainer} from "./trainer.model";

const tournamentSchema = new mongoose.Schema<Tournament>({
    trainerOne: [{type: mongoose.Types.ObjectId, ref: "Trainer"}],
    trainerTwo: [{type: mongoose.Types.ObjectId, ref: "Trainer"}],
    trainerThree: [{type: mongoose.Types.ObjectId, ref: "Trainer"}],
    trainerFour: [{type: mongoose.Types.ObjectId, ref: "Trainer"}],
    champ: [{type: mongoose.Types.ObjectId, ref: "Trainer"}],
    createdAt: { type: Date, default: Date.now, immutable: true },
});

export interface Tournament extends MongoInterface{
    trainerOne: Trainer;
    trainerTwo: Trainer;
    trainerThree: Trainer;
    trainerFour: Trainer;
    champ: Trainer;
    createdAt: Date;
}



const tournamentModel = mongoose.model<Tournament & mongoose.Document>("Tournament", tournamentSchema);

export default tournamentModel;
