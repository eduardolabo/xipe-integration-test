import * as mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as R from "ramda";
import {MongoInterface} from "../../utils/mongo.interface";

const userSchema = new mongoose.Schema<User>({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  permissions: { type: Array, of: String },
});

userSchema.methods.validPassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};
userSchema.methods.hidePassword = function () {
  return R.omit(["password"], this.toObject({ virtuals: true }));
};

userSchema.methods.hashPassword = function () {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err1, salt) => {
      if (err1) {
        reject(err1);
      }
      bcrypt.hash(this.password, salt, (err2, hash) => {
        if (err2) {
          reject(err2);
        }
        this.password = hash;
        resolve(hash);
      });
    });
  });
};

export interface User extends MongoInterface{
  username: string;
  password?: string;
  permissions: string[];
  validPassword(password: string): boolean;
  hidePassword(): User;
  hashPassword(): Promise<string>;
}

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;
