import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  UnauthorizedException,
  ConflictException,
  Request,
  Get,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('/1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    schema: {
      example: {
        status: 'success',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        status: 'error',
        message: 'Invalid username or password',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    this.logger.debug('Login request received', loginDto);
    const result = await this.authService.login(loginDto);
    this.logger.debug('JWT Token generated', { token: result.token });

    // Log JWT secret key for debugging (remove in production)
    this.logger.debug('JWT Secret Key:', process.env.JWT_SECRET);

    return result;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        message: 'Admin user registered successfully',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          fullname: 'John Doe',
          email: 'johndoe@example.com',
          username: 'johndoe',
          role: 'admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['fullname must be shorter than or equal to 100 characters'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email or username already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email or username already exists',
        error: 'Conflict',
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('admins')
  @ApiOperation({ summary: 'Get all admin users' })
  @ApiResponse({
    status: 200,
    description: 'List of all admin users',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          fullname: 'John Doe',
          email: 'johndoe@example.com',
          role: 'admin',
          created_at: '2025-03-28T06:48:23.430Z',
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          fullname: 'Jane Smith',
          email: 'janesmith@example.com',
          role: 'admin',
          created_at: '2025-03-28T06:50:23.430Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to fetch admin users',
        error: 'Internal Server Error',
      },
    },
  })
  async getAllAdmins() {
    return this.authService.getAllAdmins();
  }
  @Put('admins/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update admin user' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiBody({
    schema: {
      example: {
        fullname: 'Updated Name',
        email: 'updatedemail@example.com',
        role: 'admin',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Admin updated successfully',
    schema: {
      example: {
        message: 'Admin updated successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Admin with ID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to update admin',
        error: 'Internal Server Error',
      },
    },
  })
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateData: Partial<RegisterDto>,
  ) {
    return this.authService.updateAdmin(id, updateData);
  }

  @Delete('admins/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete admin user' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({
    status: 200,
    description: 'Admin deleted successfully',
    schema: {
      example: {
        message: 'Admin deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Admin with ID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to delete admin',
        error: 'Internal Server Error',
      },
    },
  })
  async deleteAdmin(@Param('id') id: string) {
    return this.authService.deleteAdmin(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updatePassword(
    @Request() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    this.logger.debug('Password update request received', {
      userId: req.user.sub,
    });
    return this.authService.updatePassword(req.user.sub, updatePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user.sub, updateProfileDto);
  }
}
