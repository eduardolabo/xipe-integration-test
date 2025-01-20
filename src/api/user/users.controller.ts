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
import { Permissions } from "../../common/utils/permissions.utils";
import { CreateUserDto } from "./dto/users.dto";
import UserService from "./users.service";

@Route("user")
@Tags("User")
export class UsersController extends Controller {
  public userService = new UserService();

  constructor() {
    super();
  }
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
