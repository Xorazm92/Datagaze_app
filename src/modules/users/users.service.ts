// users.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly tableName = 'admin';

  constructor(@InjectModel() private readonly knex: Knex) {}

  async findAll() {
    // Bu yerda 'users' jadval nomi to'g'ri ekanligiga ishonch hosil qiling
    return this.knex(this.tableName).select('*');
  }

  async create(createUserDto: CreateUserDto) {
    const { fullname, username, email, password, role } = createUserDto;

    // Email yoki username allaqachon mavjudligini tekshirish
    const existingUser = await this.knex(this.tableName)
      .where({ email })
      .orWhere({ username })
      .first();

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await this.knex(this.tableName)
      .insert({
        fullname,
        username,
        email,
        password: hashedPassword,
        role: role || 'admin', // Agar DTOda rol kelmasa, standart 'admin' bo'ladi
      })
      .returning(['id', 'fullname', 'username', 'email', 'role']);

    return newUser;
  }

  async findOne(id: string) {
    return this.knex(this.tableName).where({ id }).first();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...otherData } = updateUserDto;
    const updateData: any = { ...otherData };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const [updatedUser] = await this.knex(this.tableName)
      .where({ id })
      .update(updateData)
      .returning(['id', 'fullname', 'username', 'email', 'role']);

    return updatedUser;
  }

  async remove(id: string) {
    return this.knex(this.tableName).where({ id }).del();
  }

}
