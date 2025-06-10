import { Controller, Post, Body, Param, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SystemRequirementsDto } from './dto/system-requirements.dto';
import { InstallationScriptDto } from './dto/installation-script.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiOperation } from '@nestjs/swagger';
import { ProductService } from './product.service';


@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(':id/requirements')
  @ApiOperation({ summary: 'Add system requirements' })
  async addSystemRequirements(
    @Param('id') productId: string,
    @Body() requirementsDto: SystemRequirementsDto,
  ) {
    return this.productService.addSystemRequirements(productId, requirementsDto);
  }

  @Post(':id/installation-script')
  @ApiOperation({ summary: 'Add installation script' })
  async addInstallationScript(
    @Param('id') productId: string,
    @Body() scriptDto: InstallationScriptDto,
  ) {
    return this.productService.addInstallationScript(productId, scriptDto);
  }
}