import { CreateUserDto } from "../dtos/users.dto";
import HttpException from "../exceptions/HttpException";
import { User } from "../models/users.model";
import userModel from "../models/users.model";

class UserService {
  public users = userModel;

  public async findAllUser(): Promise<User[]> {
    return this.users.find();
  }

  public async findUserById(userId: string): Promise<User> {
    const user = await this.users.findById(userId);
    if (user) return user;
    throw new HttpException(409, "You're not user");
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (await this.users.findOne({ username: userData.username })) {
      throw new HttpException(
        400,
        `User with username ${userData.username} already exists`
      );
    }
    return await this.users.create(userData);
  }

  public async updateUser(userId: string, userData: User): Promise<User> {
    const user = await this.users.findByIdAndUpdate(userId, userData);
    if (user) return user;
    throw new HttpException(409, "You're not user");
  }

  public async deleteUserData(userId: string): Promise<User> {
    const user = await this.users.findByIdAndDelete(userId);
    if (user) return user;
    throw new HttpException(409, "You're not user");
  }
}

export default UserService;
