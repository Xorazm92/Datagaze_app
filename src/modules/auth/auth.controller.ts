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
@Controller('auth')
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
  schema: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'error' },
      message: { type: 'string', example: 'Unauthorized access' }
    }
  }
})
@ApiResponse({
  status: 500,
  description: 'Internal server error',
  schema: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'error' },
      message: { type: 'string', example: 'An unexpected error occurred' }
    }
  }
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login to get access token',
    description: 'Authenticate user and get JWT token for accessing protected endpoints'
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      success: {
        value: {
          username: 'Zufar92',
          password: 'Admin@123'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '1' },
                username: { type: 'string', example: 'Zufar92' },
                email: { type: 'string', example: 'xorazm92@gmail.com' },
                role: { type: 'string', example: 'super_admin' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Invalid username or password' }
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Register new admin (Superadmin only)',
    description: 'Create a new admin user. Only accessible by super admin.'
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      success: {
        value: {
          username: 'new_admin',
          email: 'newadmin@example.com',
          password: 'StrongPassword@456'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Admin registered successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '2' },
            username: { type: 'string', example: 'new_admin' },
            email: { type: 'string', example: 'newadmin@example.com' },
            role: { type: 'string', example: 'admin' },
            created_at: { type: 'string', example: '2025-02-28T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or username taken',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Username already taken' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'username' },
              message: { type: 'string', example: 'Username already exists' }
            }
          }
        }
      }
    }
  })
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
  @ApiOperation({
    summary: 'Update user password',
    description: 'Allow user to update their own password'
  })
  @ApiBody({
    type: UpdatePasswordDto,
    examples: {
      success: {
        value: {
          old_password: 'OldPass@123',
          new_password: 'NewPass@456'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Password updated successfully' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid password',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Current password is incorrect' }
      }
    }
  })
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
