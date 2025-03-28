import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Logger,
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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const role = 'admin';
  
    const newUser = {
      fullname: registerDto.fullname,
      email: registerDto.email,
      username: registerDto.username,
      password: hashedPassword,
      role: role,
    };
  
    try {
      // Email yoki username allaqachon mavjudligini tekshirish
      const existingUser = await this.knex('admin') 
        .where({ email: registerDto.email })
        .orWhere({ username: registerDto.username })
        .first();
  
      if (existingUser) {
        throw new ConflictException('Email or username already exists');
      }
  
      // Foydalanuvchini ma'lumotlar bazasiga qo'shish
      const [userId] = await this.knex('admin') // "users" o'rniga "admin" jadvali
        .insert(newUser)
        .returning('id');
  
      this.logger.log(`New admin user registered: ${newUser.username}`);
  
      return {
        message: 'Admin user registered successfully',
        user: {
          id: userId,
          fullname: newUser.fullname,
          email: newUser.email,
          username: newUser.username,

          role: newUser.role,
        },
      };
    } catch (error) {
      this.logger.error('Error registering user', error);
      throw new ConflictException('Failed to register user');
    }
  }

  async login(loginDto: LoginDto) {
    this.logger.log(`Login attempt for user: ${loginDto.username}`);
    
    if (loginDto.username === 'superadmin' && loginDto.password === 'superadmin') {
      const payload = { 
        sub: '123e4567-e89b-12d3-a456-426614174000',
        username: loginDto.username,
        role: 'superadmin'
      };
      
      const token = this.jwtService.sign(payload);
      this.logger.log(`Login successful for user: ${loginDto.username}`);
      
      return {
        status: 'success',
        token: token,
        user: {
          id: payload.sub,
          username: payload.username,
          role: payload.role
        }
      };
    }
    this.logger.warn(`Login failed for user: ${loginDto.username}`);
    throw new UnauthorizedException('Invalid credentials');
  }

  async getAllAdmins() {
    try {
      // Ma'lumotlar bazasidan barcha adminlarni olish
      const admins = await this.knex('admin').select('id', 'fullname', 'email', 'role', 'created_at');
      return admins;
    } catch (error) {
      this.logger.error('Error fetching admin users', error);
      throw new Error('Failed to fetch admin users');
    }
  }
  async updateAdmin(adminId: string, updateData: Partial<RegisterDto>) {
    try {
      // Foydalanuvchini yangilash
      const updatedRows = await this.knex('admin')
        .where({ id: adminId })
        .update(updateData);
  
      if (updatedRows === 0) {
        throw new NotFoundException(`Admin with ID ${adminId} not found`);
      }
  
      this.logger.log(`Admin with ID ${adminId} updated successfully`);
      return { message: 'Admin updated successfully' };
    } catch (error) {
      this.logger.error(`Error updating admin with ID ${adminId}`, error);
      throw new Error('Failed to update admin');
    }
  }

  async deleteAdmin(adminId: string) {
    try {
      // Foydalanuvchini o'chirish
      const deletedRows = await this.knex('admin')
        .where({ id: adminId })
        .del();
  
      if (deletedRows === 0) {
        throw new NotFoundException(`Admin with ID ${adminId} not found`);
      }
  
      this.logger.log(`Admin with ID ${adminId} deleted successfully`);
      return { message: 'Admin deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting admin with ID ${adminId}`, error);
      throw new Error('Failed to delete admin');
    }
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
