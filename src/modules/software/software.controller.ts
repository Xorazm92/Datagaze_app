import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { SoftwareService } from './software.service';
import { CreateSoftwareDto, UpdateSoftwareDto } from './dto/software.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Express } from 'express';

@ApiTags('Software')
@Controller('api/software')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized - JWT token is missing or invalid' })
@ApiResponse({ status: 403, description: 'Forbidden - User does not have required permissions' })
@ApiResponse({ status: 500, description: 'Internal server error' })
export class SoftwareController {
  constructor(private readonly softwareService: SoftwareService) {}

  @Post('upload/icon')
  @ApiOperation({ summary: 'Upload software icon' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Software icon file (jpg, jpeg, png, gif)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Icon uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            filename: { type: 'string', example: 'dlp.png' },
            path: { type: 'string', example: '/public/assets/logo/dlp.png' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid file type or no file uploaded' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/assets/logo',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadIcon(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return {
      status: 'success',
      data: {
        filename: file.filename,
        path: `/public/assets/logo/${file.filename}`,
      },
    };
  }

  @Post('upload/executable')
  @ApiOperation({ summary: 'Upload software executable' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Software executable file (exe, msi, dmg, deb, rpm)',
        },
        appName: {
          type: 'string',
          description: 'Name of the application',
          example: 'dlp',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Executable uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            filename: { type: 'string', example: 'dlp-4.7.2.exe' },
            path: { type: 'string', example: '/public/files/web_applications/dlp/dlp-4.7.2.exe' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid file type, no file uploaded, or missing appName' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        appName: {
          type: 'string',
          description: 'Name of the application',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const appName = req.body.appName?.toLowerCase() || 'other';
          const dir = `./public/files/web_applications/${appName}`;
          try {
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
          } catch (error) {
            cb(error, null);
          }
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(exe|msi|dmg|deb|rpm)$/)) {
          return cb(new Error('Only executable files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadExecutable(
    @UploadedFile() file: Express.Multer.File,
    @Body('appName') appName: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return {
      status: 'success',
      data: {
        filename: file.filename,
        path: `/public/files/web_applications/${appName?.toLowerCase() || 'other'}/${file.filename}`,
      },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all software' })
  @ApiResponse({
    status: 200,
    description: 'List of software retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '832f6fa7-dad4-430a-9206-5fb118d36f26' },
              application_name: { type: 'string', example: 'DLP' },
              version: { type: 'string', example: '4.7.2' },
              is_installed: { type: 'boolean', example: false },
              path_to_file: { type: 'string', example: '/files/web_applications/dlp/dlp-4.7.2.exe' },
              path_to_icon: { type: 'string', example: '/assets/logo/dlp.png' },
              created_at: { type: 'string', example: '2025-02-20T20:03:34.977Z' },
              updated_at: { type: 'string', example: '2025-02-20T20:03:34.977Z' }
            }
          }
        }
      }
    }
  })
  findAll() {
    return this.softwareService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get software by ID' })
  @ApiResponse({
    status: 200,
    description: 'Software retrieved successfully'
  })
  findOne(@Param('id') id: string) {
    return this.softwareService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new software' })
  @ApiResponse({
    status: 201,
    description: 'Software created successfully'
  })
  create(@Body() createSoftwareDto: CreateSoftwareDto) {
    return this.softwareService.create(createSoftwareDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update software' })
  @ApiResponse({
    status: 200,
    description: 'Software updated successfully'
  })
  update(
    @Param('id') id: string,
    @Body() updateSoftwareDto: UpdateSoftwareDto,
  ) {
    return this.softwareService.update(id, updateSoftwareDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete software' })
  @ApiResponse({
    status: 200,
    description: 'Software deleted successfully'
  })
  remove(@Param('id') id: string) {
    return this.softwareService.remove(id);
  }
}
