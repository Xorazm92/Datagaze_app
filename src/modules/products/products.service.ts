import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly tableName = 'products';

  constructor(@InjectModel() private readonly knex: Knex) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const [product] = await this.knex(this.tableName)
      .insert(createProductDto)
      .returning('*');
    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.knex(this.tableName).select('*');
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.knex(this.tableName).where({ id }).first();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const [updatedProduct] = await this.knex(this.tableName)
      .where({ id })
      .update(updateProductDto)
      .returning('*');
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedCount = await this.knex(this.tableName).where({ id }).del();
    if (deletedCount === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return { message: `Product with ID ${id} successfully deleted` };
  }
}
