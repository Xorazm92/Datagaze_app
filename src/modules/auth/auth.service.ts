import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import {
  UpdatePasswordDto,
  SuperAdminUpdatePasswordDto,
} from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse } from '../../common/interfaces/api-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectConnection() private readonly knex: Knex,
  ) {}

  private async findUserByUsername(username: string): Promise<any> {
    return this.knex('admin')
      .where({ username, status: 'active' })
      .first();
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async comparePasswords(plainText: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashedPassword);
  }

  private generateToken(payload: { sub: string; username: string }): string {
    return this.jwtService.sign(payload);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findUserByUsername(username);
    if (user && await this.comparePasswords(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<ApiResponse> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.updateLastLogin(user.id);
    const token = this.generateToken({ sub: user.id, username: user.username });

    return {
      status: 'success',
      data: { token }
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

  private async isSuperAdmin(userId: string): Promise<boolean> {
    const user = await this.knex('admin')
      .where({ id: userId, role: 'super_admin' })
      .first();
    return !!user;
  }

  async createUser(registerDto: RegisterDto, creatorId: string): Promise<ApiResponse> {
    if (!await this.isSuperAdmin(creatorId)) {
      throw new UnauthorizedException('Only super admin can create new admins');
    }

    await this.validateNewUser(registerDto);
    const hashedPassword = await this.hashPassword(registerDto.password);
    
    const [newUser] = await this.knex('admin')
      .insert({
        ...registerDto,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        created_at: this.knex.fn.now(),
        updated_at: this.knex.fn.now()
      })
      .returning(['id', 'username', 'email', 'status', 'role']);

    return {
      status: 'success',
      message: 'Admin created successfully',
      data: newUser
    };
  }

  private async validateNewUser(registerDto: RegisterDto) {
    const existingUser = await this.knex('admin')
      .where({ username: registerDto.username })
      .orWhere({ email: registerDto.email })
      .first();

    if (existingUser) {
      throw new UnauthorizedException('Username or email already exists');
    }
  }

  private async updateLastLogin(userId: string) {
    await this.knex('admin')
      .where({ id: userId })
      .update({ last_login: this.knex.fn.now() });
  }
}
