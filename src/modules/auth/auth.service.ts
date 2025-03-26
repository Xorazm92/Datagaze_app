import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Mock registration - in real app would save to database
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const role = registerDto.email === 'admin@example.com' ? 'admin' : 'user';
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: registerDto.email,
      username: registerDto.username,
      role
    };
  }

  async login(loginDto: LoginDto) {
    if (loginDto.username === 'superadmin' && loginDto.password === 'superadmin') {
      const token = this.jwtService.sign({ 
        sub: '123e4567-e89b-12d3-a456-426614174000',
        username: loginDto.username,
        role: 'super_admin'
      });
      
      return {
        access_token: token,
        redirect_url: '/dashboard'
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    // Mock password update - in real app would update in database
    return { message: 'Password updated successfully' };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    // Mock profile update - in real app would update in database
    return {
      id: userId,
      email: updateProfileDto.email,
      username: updateProfileDto.username
    };
  }
}
