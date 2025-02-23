import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import {
  UpdatePasswordDto,
  SuperAdminUpdatePasswordDto,
} from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RegisterDto } from './dto/register.dto';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {}

  async validateAdmin(
    username: string,
    email: string,
    password: string,
  ): Promise<any> {
    const admin = await this.adminService.findByUsernameOrEmail(
      username,
      email,
    );
    if (admin && (await bcrypt.compare(password, admin.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const admin = await this.validateAdmin(
      loginDto.username,
      loginDto.email,
      loginDto.password,
    );

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: admin.username, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
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
      message: 'Password updated successfully',
    };
  }

  async superAdminUpdatePassword(dto: SuperAdminUpdatePasswordDto) {
    const hashedPassword = await bcrypt.hash(dto.new_password, 10);

    await this.knex('admin')
      .where({ id: dto.user_id })
      .update({ password: hashedPassword });

    return {
      status: 'success',
      message:
        'Password updated successfully. Provide it physically to the user.',
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

    await this.knex('admin').where({ id: userId }).update({
      username: dto.username,
      name: dto.name,
      email: dto.email,
    });

    return {
      status: 'success',
      message: 'Profile updated successfully',
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      console.log('Register attempt:', {
        username: registerDto.username,
        email: registerDto.email,
      });

      // Check if username already exists
      const existingUser = await this.knex('admin')
        .where({ username: registerDto.username })
        .first();

      if (existingUser) {
        console.log('Registration failed: Username already exists', {
          username: registerDto.username,
        });
        throw new BadRequestException('Username already taken');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      // Create new user
      const newUser = {
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        created_at: this.knex.fn.now(),
        updated_at: this.knex.fn.now(),
      };

      console.log('Creating new user:', {
        ...newUser,
        password: '[HIDDEN]',
      });

      await this.knex('admin').insert(newUser);

      console.log('User registered successfully:', {
        username: registerDto.username,
      });

      return {
        status: 'success',
        message: 'User registered successfully.',
      };
    } catch (error) {
      console.error('Registration error:', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
