import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
  HttpStatus,
  Version,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  UpdatePasswordDto,
  SuperAdminUpdatePasswordDto,
} from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../../common/guards/super-admin.guard';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register new admin (Superadmin only)' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      success: {
        value: {
          username: 'new_admin',
          email: 'newadmin@example.com',
          password: 'StrongPassword@456',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
    schema: {
      example: {
        status: 'success',
        message: 'User registered successfully.',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Username already taken',
    schema: {
      example: {
        status: 'error',
        message: 'Username already taken',
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Put('update-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({
    type: UpdatePasswordDto,
    examples: {
      success: {
        value: {
          old_password: 'TemporaryPass$987',
          new_password: 'NewTemporaryPass987!',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password updated successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Password updated successfully.',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Password does not meet complexity requirements',
    schema: {
      example: {
        status: 'error',
        message: 'Password does not meet complexity requirements.',
      },
    },
  })
  async updatePassword(
    @Request() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(req.user.sub, updatePasswordDto);
  }

  @Put('super-admin/update-password')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Superadmin updates user password' })
  @ApiBody({
    type: SuperAdminUpdatePasswordDto,
    examples: {
      success: {
        value: {
          user_id: 2,
          new_password: 'TemporaryPass$987',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password updated successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Password updated successfully. Provide it physically to the user.',
      },
    },
  })
  async superAdminUpdatePassword(
    @Body() updatePasswordDto: SuperAdminUpdatePasswordDto,
  ) {
    return this.authService.superAdminUpdatePassword(updatePasswordDto);
  }

  @Put('update-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({
    type: UpdateProfileDto,
    examples: {
      success: {
        value: {
          username: 'admin',
          name: 'New Admin Name',
          email: 'newemail@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Profile updated successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Username already taken',
    schema: {
      example: {
        status: 'error',
        message: 'Username has been already taken.',
      },
    },
  })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user.sub, updateProfileDto);
  }
}
