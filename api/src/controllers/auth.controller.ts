import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import AuthService from "../services/auth.service";
import { Permissions } from "../utils/permissions.utils";
import { signInOptions, signUpOptions } from "../dtos/auth.dto";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  public authService = new AuthService();

  @Get("me")
  @Security("jwt", [])
  public async getMe(@Request() request: any) {
    try {
      console.log("getMe");
      return this.authService.getMe(request);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get("permissions")
  @Security("jwt", [Permissions.USER_WRITE])
  public async permissionList() {
    return Object.values(Permissions);
  }

  @Post("login")
  public async signIn(@Body() userData: signInOptions) {
    try {
      return this.authService.signIn({
        username: userData.username.toLowerCase(),
        password: userData.password,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post("create-user")
  @Security("jwt", [Permissions.USER_CREATE])
  public async createUser(@Body() userData: signUpOptions) {
    try {
      return this.authService.createUser(userData);
    } catch (error) {
      throw new Error(error);
    }
  }
}
