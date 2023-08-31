import {IsBoolean, IsString} from "class-validator";

export class CreateTournamentDto {
    @IsString()
    public trainerOneId: string;
    @IsString()
    public trainerTwoId: string;
    @IsString()
    public trainerThreeId: string;
    @IsString()
    public trainerFourId: string;
    @IsString()
    public champId: string;


}
