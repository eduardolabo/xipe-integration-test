import { StrategyOptions, VerifiedCallback } from "passport-jwt";

const LocalStrategy = require("passport-local").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
import { User } from "../models/users.model";
import userModel from "../models/users.model";
import { IVerifyOptions } from "passport-local";
import express from "express";
const users = userModel;

const local = new LocalStrategy(
  (
    username: string,
    password: string,
    done: (
      error: any,
      user?: Express.User | false,
      options?: IVerifyOptions
    ) => void
  ) => {
    users.findOne({ username }).then((user: User) => {
      if (!user) {
        return done(null, false, { message: "Username doesn't exist" });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect username or password" });
      }
      return done(null, user);
    });
  }
);

let opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SESSION_SECRET,
  passReqToCallback: true,
};
const jwt = new JwtStrategy(
  opts,
  (req: express.Request, token: User | null, done: VerifiedCallback) => {
    if (token._id.match(/^[0-9a-fA-F]{24}$/)) {
      users.findOne({ _id: token._id }).then((user: any) =>{
        if (user) {
          return done(null, user.hidePassword());
        } else {
          return done(null, false);
        }
      });
    } else return done("Unauthorized!", false);
  }
);

export default { local, jwt };
