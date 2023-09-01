import { IsString, IsUrl } from 'class-validator';

export class CreateShortenUrlDTO {
  @IsString()
  @IsUrl()
  url: string;
}
