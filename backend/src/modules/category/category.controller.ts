import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../users/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { ResponseCategoryDto } from './dto/response-category.dto.js';
import { QueryCategoryDto } from './dto/query-categoty.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CloudinaryService } from '../../common/services/cloudinary.service.js';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiTags('create category')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ description: 'create new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Category created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbiden' })
  async create(
    @Body()
    createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ description: 'get all categories' })
  @ApiResponse({
    status: 200,
    description: 'list of categories retrived successfull',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#components/schemas/CategoryResponseDto' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async findAll(@Query() querydto: QueryCategoryDto) {
    return await this.categoryService.findAll(querydto);
  }

  @Get('slug/:slug')
  @ApiOperation({ description: 'get categoty by slug' })
  @ApiResponse({
    status: 200,
    description: 'Category details',
    type: ResponseCategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  async findBySlug(@Param('slug') slug: string): Promise<ResponseCategoryDto> {
    return await this.categoryService.findBySlug(slug);
  }
  @Get('upload-signature')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get Cloudinary upload signature' })
  async getUploadSignature() {
    return this.cloudinaryService.generateUploadSignature('categories');
  }

  @Get(':id')
  @ApiOperation({ description: 'get one category' })
  @ApiResponse({
    status: 200,
    description: 'Category details',
    type: ResponseCategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  async findOne(@Param('id') id: string): Promise<ResponseCategoryDto> {
    return await this.categoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update category(Admin only)' })
  @ApiBody({
    type: UpdateCategoryDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: ResponseCategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Category slug already',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete category(Admin only)' })
  @ApiResponse({
    status: 400,
    description: 'Can not delete category with products',
  })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return await this.categoryService.delete(id);
  }
}
