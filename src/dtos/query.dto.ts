import { IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class queryDto {
  @IsNumber()
  @IsOptional()
  public page?: number;

  @IsNumber()
  @IsOptional()
  public limit?: number;

  @IsString()
  @IsOptional()
  public search?: string;

  @IsObject()
  @IsOptional()
  public filters?: any;

  @IsString()
  @IsOptional()
  public orderBy?: string;
}
