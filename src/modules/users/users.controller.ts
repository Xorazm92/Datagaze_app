// users.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'List of all users.', type: [UserEntity] })
  async findAll() {
    const users = await this.usersService.findAll();
    // Parolni javobdan olib tashlash
    return users.map(({ password, ...result }) => result);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: UserEntity })
  @ApiResponse({ status: 409, description: 'Username or email already exists.' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    // Parolni javobdan olib tashlash
    const { password, ...result } = newUser;
    return result;
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiOkResponse({ description: 'The user object.', type: UserEntity })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    // Parolni javobdan olib tashlash
    const { password, ...result } = user;
    return result;
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({ description: 'The updated user object.', type: UserEntity })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // Avval foydalanuvchi mavjudligini tekshiramiz
    const existingUser = await this.usersService.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    const updatedUser = await this.usersService.update(id, updateUserDto);
    const { password, ...result } = updatedUser;
    return result;
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'The user has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const existingUser = await this.usersService.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    await this.usersService.remove(id);
  }

  // Boshqa CRUD endpointlari keyinroq qo'shiladi
}
