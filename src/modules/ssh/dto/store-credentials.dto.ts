import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum AuthType {
  PASSWORD = 'password',
  KEY = 'key'
}

export class StoreCredentialsDto {
  @IsString()
  serverId: string;

  @IsString()
  username: string;

  @IsEnum(AuthType)
  authType: AuthType;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  privateKey?: string;

  @IsOptional()
  @IsString()
  passphrase?: string;
}
