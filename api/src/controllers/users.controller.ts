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
} from 'tsoa';

import { CreateUserDto } from '../dtos/users.dto';
import UserService from '../services/users.service';
import { Permissions } from '../utils/permissions.utils';

@Route("user")
@Tags("User")
export class UsersController extends Controller {
    public userService = new UserService();

    @Get("")
    @Security("jwt", [Permissions.USER_READ])
    public async getUsers(@Request() request: any) {
        return await this.userService.findAllUser();
    }

    @Get("{userId}")
    public async getUserById(@Path() userId: string) {
        try {
            return this.userService.findUserById(userId);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Post("")
    public async createUser(@Body() userData: CreateUserDto) {
        try {
            return this.userService.createUser(userData);
        } catch (error) {
            throw new Error(error);
        }
    }
}
