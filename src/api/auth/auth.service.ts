import userModel from "../../common/db/models/users.model";
import { signInOptions, signUpOptions } from "../../api/auth/dto/auth.dto";
import HttpException from "../../common/exceptions/HttpException";
import passport from "passport";
import express from "express";
import jsonwebtoken from "jsonwebtoken";

export default class AuthService {
  public users = userModel;

  public async signIn({
    username,
    password,
  }: signInOptions): Promise<{ message: string; token: string }> {
    const user = await this.users.findOne({ username });
    if (!user) throw new HttpException(409, "Username not found");
    if (user.validPassword(password)) {
      const token = jsonwebtoken.sign(
        user.hidePassword(),
        process.env.SESSION_SECRET
      );
      return { message: "success", token };
    }
    throw new HttpException(409, "Password not found");
  }

  public async getMe(request: express.Request) {
    return new Promise((resolve, reject) => {
      passport.authenticate("jwt", { session: false }, (err: any, user: unknown) => {
        if (err) reject(err);
        if (user) resolve(user);
        else reject(new Error("Unauthorized!"));
      })(request);
    });
  }

  public async createUser(userData: signUpOptions) {
    const formatedData = {
      username: userData.username.toLowerCase(),
      ...userData,
    };
    const user = await this.users.create(formatedData);
    await user.hashPassword();
    await user.save();
    return user.hidePassword();
  }
}
