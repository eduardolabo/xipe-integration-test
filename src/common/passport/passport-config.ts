import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { v4 } from "uuid";
import session from "express-session";
import passport from "passport";
import Strategies from "./strategies";
import express from "express";
import userModel, { User } from "../db/models/users.model";

export default (app: express.Application) => {
  const sessionConfig = {
    store: new MongoStore({
      client: mongoose.connection.getClient(),
      collectionName: "sessions",
    }),
    genid: () => v4(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  };

  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user: User, done: (err: any, id?: string) => void) =>
    done(null, user._id)
  );

  passport.deserializeUser(
    (
      id: string,
      done: (err: any, user?: Express.User | false | null) => void
    ) =>
      userModel
        .findById({ _id: id })
        .then((user: User) => done(null, user))
        .catch((err: Error) => console.warn(`err at deserialize: ${err}`))
  );
  passport.use("local", Strategies.local);
  passport.use("jwt", Strategies.jwt);
};
