import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { LoginDto, RegisterDto, UpdateProfileDto, UpdatePasswordDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const admin = await this.adminService.findByUsername(loginDto.username);
    if (!admin) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (admin.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    await this.adminService.updateLastLogin(admin.id);

    const token = this.jwtService.sign({ 
      id: admin.id,
      role: admin.role 
    });

    return {
      status: 'success',
      token,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingAdmin = await this.adminService.findByUsername(registerDto.username);
    if (existingAdmin) {
      throw new BadRequestException('Username already taken');
    }

    const existingEmail = await this.adminService.findByEmail(registerDto.email);
    if (existingEmail) {
      throw new BadRequestException('Email already taken');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    await this.adminService.create({
      ...registerDto,
      password: hashedPassword,
      role: 'admin',
    });

    return {
      status: 'success',
      message: 'User registered successfully',
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const admin = await this.adminService.findById(userId);
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    if (updateProfileDto.email) {
      const existingEmail = await this.adminService.findByEmail(updateProfileDto.email);
      if (existingEmail && existingEmail.id !== userId) {
        throw new BadRequestException('Email already taken');
      }
    }

    await this.adminService.update(userId, updateProfileDto);

    return {
      status: 'success',
      message: 'Profile updated successfully',
    };
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const admin = await this.adminService.findById(userId);
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.old_password,
      admin.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(updatePasswordDto.new_password, 10);
    await this.adminService.updatePassword(userId, hashedPassword);

    return {
      status: 'success',
      message: 'Password updated successfully',
    };
  }
}
