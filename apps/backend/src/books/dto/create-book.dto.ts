import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description!: string;
}
