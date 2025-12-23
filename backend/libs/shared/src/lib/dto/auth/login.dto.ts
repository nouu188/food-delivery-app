import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}

export class LoginResponseDto {
  access_token!: string;
  refresh_token!: string;
  user!: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  };
}

export class RefreshTokenDto {
  @IsString()
  refresh_token!: string;
}

export class RefreshTokenResponseDto {
  access_token!: string;
  refresh_token!: string;
}

export class LogoutDto {
  @IsString()
  refresh_token!: string;
}
