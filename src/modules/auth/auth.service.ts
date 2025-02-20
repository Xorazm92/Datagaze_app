import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto, SuperAdminUpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectConnection() private readonly knex: Knex
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.knex('admin')
      .where({ username, status: 'active' })
      .first();

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    await this.knex('admin')
      .where({ id: user.id })
      .update({ last_login: this.knex.fn.now() });

    const payload = { sub: user.id, username: user.username };
    
    return {
      status: 'success',
      token: this.jwtService.sign(payload)
    };
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.knex('admin')
      .where({ id: userId, status: 'active' })
      .first();

    if (!user || !(await bcrypt.compare(dto.old_password, user.password))) {
      throw new UnauthorizedException('Invalid current password');
    }

    const hashedPassword = await bcrypt.hash(dto.new_password, 10);
    
    await this.knex('admin')
      .where({ id: userId })
      .update({ password: hashedPassword });

    return {
      status: 'success',
      message: 'Password updated successfully'
    };
  }

  async superAdminUpdatePassword(dto: SuperAdminUpdatePasswordDto) {
    const hashedPassword = await bcrypt.hash(dto.new_password, 10);
    
    await this.knex('admin')
      .where({ id: dto.user_id })
      .update({ password: hashedPassword });

    return {
      status: 'success',
      message: 'Password updated successfully. Provide it physically to the user.'
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const existingUser = await this.knex('admin')
      .where('username', dto.username)
      .whereNot('id', userId)
      .first();

    if (existingUser) {
      throw new UnauthorizedException('Username has been already taken');
    }

    await this.knex('admin')
      .where({ id: userId })
      .update({
        username: dto.username,
        name: dto.name,
        email: dto.email
      });

    return {
      status: 'success',
      message: 'Profile updated successfully'
    };
  }
}
