import {IsArray, IsBoolean, IsNumber, IsString} from "class-validator";

export class CreateTrainerDto {
    @IsString()
    public pokemonOneId: string;
    @IsString()
    public pokemonTwoId: string;
    @IsString()
    public pokemonThreeId: string;
    @IsString()
    public pokemonFourId: string;
    @IsString()
    public pokemonFiveId: string;
    @IsString()
    public pokemonSixId: string;
    @IsString()
    public name: string;
    @IsBoolean()
    public isChamp: boolean;

}
