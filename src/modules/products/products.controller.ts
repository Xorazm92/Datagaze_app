import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi mahsulot yaratish' })
  @ApiResponse({ status: 201, description: 'Mahsulot muvaffaqiyatli yaratildi.', type: Product })
  @ApiResponse({ status: 400, description: 'Yaroqsiz so`rov.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha mahsulotlarni olish' })
  @ApiResponse({ status: 200, description: 'Mahsulotlar ro`yxati.', type: [Product] })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta mahsulotni ID bo`yicha olish' })
  @ApiResponse({ status: 200, description: 'Mahsulot ma`lumotlari.', type: Product })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mahsulotni yangilash' })
  @ApiResponse({ status: 200, description: 'Mahsulot muvaffaqiyatli yangilandi.', type: Product })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Mahsulotni o`chirish' })
  @ApiResponse({ status: 200, description: 'Mahsulot muvaffaqiyatli o`chirildi.' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
