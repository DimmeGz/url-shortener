import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UrlParamDTO {
  @Matches(/^[a-z\A-Z\d-]/)
  @IsString()
  @MaxLength(7)
  @MinLength(7)
  shortenUrl: string;
}
