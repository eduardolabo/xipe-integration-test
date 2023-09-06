import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Request,
    Route,
    Security,
    Tags,
} from "tsoa";
import TournamentService from "../services/tournament.service";
import { Permissions } from "../utils/permissions.utils";

@Route("tournament")
@Tags("Tournament")
export class TournamentController extends Controller {
    public tournamentService= new TournamentService();

    constructor() {
        super();
    }

    @Get("/start")
    @Security("jwt", [Permissions.USER_READ])
    public async startTournament(@Request() request: any) {
        return await this.tournamentService.startTournament();
    }    
}
