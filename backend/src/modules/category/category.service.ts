import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { ResponseCategoryDto } from './dto/response-category.dto.js';
import { Category, Prisma } from '@prisma/client';
import { QueryCategoryDto } from './dto/query-categoty.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto): Promise<ResponseCategoryDto> {
    const { name, slug, isActive, ...rest } = dto;

    //тільки для англійської або транслітерації, видалить кирилицю
    const slugCategory =
      slug ??
      name
        .toLocaleLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: slugCategory },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with slug "${slugCategory}" already exists`,
      );
    }

    const category = await this.prisma.category.create({
      data: { name, slug: slugCategory, isActive: isActive ?? true, ...rest },
    });

    return this.formatCategory(category, 0);
  }

  async findAll(dto: QueryCategoryDto): Promise<{
    data: ResponseCategoryDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { isActive, search, page = 1, limit = 10 } = dto;

    const where: Prisma.CategoryWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        {
          name: { contains: search, mode: 'insensitive' },
        },
        {
          description: { contains: search, mode: 'insensitive' },
        },
      ];
    }
    const [total, categories] = await Promise.all([
      this.prisma.category.count({ where }),

      this.prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      }),
    ]);
    return {
      data: categories.map((category) =>
        this.formatCategory(category, category._count.products),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ResponseCategoryDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.formatCategory(category, Number(category._count.products));
  }

  async findBySlug(slug: string): Promise<ResponseCategoryDto> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.formatCategory(category, Number(category._count.products));
  }

  async update(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    if (dto.slug && dto.slug !== existingCategory.slug) {
      const slugTaken = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });

      if (slugTaken) {
        throw new ConflictException(
          `Category with slug "${dto.slug}" already exists`,
        );
      }
    }

    // Не дозволяємо змінити URL, залишивши старий publicId.
    if (
      dto.imageUrl !== undefined &&
      dto.imageUrl !== existingCategory.imageUrl &&
      dto.imagePublicId === undefined
    ) {
      throw new BadRequestException(
        'imagePublicId must be provided when changing imageUrl',
      );
    }

    const oldPublicId = existingCategory.imagePublicId;
    const newPublicId = dto.imagePublicId;

    const updatedCategory = await this.prisma.$transaction(async (tx) => {
      if (
        oldPublicId &&
        newPublicId !== undefined &&
        oldPublicId !== newPublicId
      ) {
        await tx.cloudinaryDeletion.create({
          data: { publicId: oldPublicId },
        });
      }

      return tx.category.update({
        where: { id },
        data: dto,
        include: {
          _count: {
            select: { products: true },
          },
        },
      });
    });

    return this.formatCategory(
      updatedCategory,
      updatedCategory._count.products,
    );
  }

  async delete(id: string): Promise<{ message: string }> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.products > 0) {
      throw new BadRequestException(
        `Cannot delete category "${category.slug}" because it contains ${category._count.products} product(s)`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      if (category.imagePublicId) {
        await tx.cloudinaryDeletion.create({
          data: {
            publicId: category.imagePublicId,
          },
        });
      }

      await tx.category.delete({
        where: { id },
      });
    });

    return {
      message: `Category "${category.slug}" deleted successfully`,
    };
  }

  private formatCategory(
    category: Category,
    productCount: number,
  ): ResponseCategoryDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      imageUrl: category.imageUrl,
      imagePublicId: category.imagePublicId,
      isActive: category.isActive,
      productCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
