import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class signInOptions {
  @IsString()
  public username: string;

  @IsString()
  public password: string;
}

export class signUpOptions {
  @IsString()
  public username: string;

  @IsString()
  public password: string;

  // @IsOptional()
  // @IsNumber(undefined, { each: true })
  // @Transform(({ value }) => new Map(Object.entries(value)))
  // prop?: Map<string, string>;
}
