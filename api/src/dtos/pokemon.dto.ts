import {IsString, IsNumber, IsArray} from "class-validator";

export class CreatePokemonDto {
    @IsString()
    public name: string;
    @IsArray()
    public types: string[];
    @IsArray()
    public moves: string[];
    @IsNumber()
    public level: number;
}
