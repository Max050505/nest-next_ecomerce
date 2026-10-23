import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductResponseDto } from './dto/product-response.dto.js';
import { Category, Prisma, Product, ProductImage } from '@prisma/client';
import { QueryProductDto } from './dto/query-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CloudinaryService } from '../../common/services/cloudinary.service.js';

type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
};
@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const { categoryId, images, ...productData } = createProductDto;

    const existingSku = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existingSku) {
      throw new ConflictException(
        `Product with sku ${createProductDto.sku} already exists`,
      );
    }

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = await this.prisma.product.create({
      data: {
        ...productData,

        price: new Prisma.Decimal(createProductDto.price),

        category: {
          connect: {
            id: categoryId,
          },
        },
        images:
          images && images.length > 0
            ? {
                create: images.map((image, index) => ({
                  url: image.url,
                  publicId: image.publicId,
                  position: index,
                })),
              }
            : undefined,
      },

      include: {
        category: true,
        images: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    return this.formatProduct(product);
  }

  async findAll(queryDto: QueryProductDto): Promise<{
    data: ProductResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const {
      category,
      isActive,
      search,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 10,
    } = queryDto;

    const where: Prisma.ProductWhereInput = {};

    // Фільтр за категорією
    if (category) {
      where.categoryId = category;
    }

    // Фільтр за активністю
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Пошук за назвою або описом
    if (search?.trim()) {
      where.OR = [
        {
          name: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    // Фільтр за мінімальною та максимальною ціною
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }

    // Показувати лише товари в наявності
    if (inStock) {
      where.stock = { gt: 0 };
    }

    const total = await this.prisma.product.count({ where });

    const products = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    return {
      data: products.map((product) => this.formatProduct(product)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('No product');
    }

    return this.formatProduct(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (dto.sku && dto.sku !== existingProduct.sku) {
      const skuTaken = await this.prisma.product.findUnique({
        where: { sku: dto.sku },
      });

      if (skuTaken) {
        throw new ConflictException(
          `Product with sku ${dto.sku} already exists`,
        );
      }
    }

    const { images, categoryId, ...productData } = dto;

    if (categoryId !== undefined) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    // Видаляємо тільки ті файли, які належали цьому товару
    // і відсутні в новому списку.
    const retainedPublicIds = new Set(
      (images ?? []).map((image) => image.publicId),
    );

    const removedPublicIds =
      images === undefined
        ? []
        : [
            ...new Set(
              existingProduct.images
                .filter((image) => !retainedPublicIds.has(image.publicId))
                .map((image) => image.publicId),
            ),
          ];

    const updatedProduct = await this.prisma.$transaction(async (tx) => {
      // Завдання на видалення зберігаються атомарно
      // разом з оновленням товару.
      if (removedPublicIds.length > 0) {
        await tx.cloudinaryDeletion.createMany({
          data: removedPublicIds.map((publicId) => ({ publicId })),
        });
      }

      const data: Prisma.ProductUpdateInput = {
        ...productData,
      };

      if (dto.price !== undefined) {
        data.price = new Prisma.Decimal(dto.price);
      }

      if (categoryId !== undefined) {
        data.category = {
          connect: { id: categoryId },
        };
      }

      if (images !== undefined) {
        data.images = {
          deleteMany: {},
          create: images.map((image, index) => ({
            url: image.url,
            publicId: image.publicId,
            alt: image.alt,
            position: index,
          })),
        };
      }

      return tx.product.update({
        where: { id },
        data,
        include: {
          category: true,
          images: {
            orderBy: { position: 'asc' },
          },
        },
      });
    });

    return this.formatProduct(updatedProduct);
  }

  async updateStock(id: string, quantity: number): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    const newStock = product.stock + quantity;

    if (newStock < 0) {
      throw new BadRequestException('Infussient stock');
    }
    const updateProduct = await this.prisma.product.update({
      where: { id },
      data: { stock: newStock },
      include: {
        category: true,
        images: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
    return this.formatProduct(updateProduct);
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
        cartItems: true,
        images: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.orderItems.length > 0) {
      throw new BadRequestException(
        'Cannot delete a product that belongs to existing orders.',
      );
    }

    if (product.cartItems.length > 0) {
      throw new BadRequestException(
        'Cannot delete a product that is currently in carts.',
      );
    }

    const publicIds = [
      ...new Set(product.images.map((image) => image.publicId)),
    ];

    await this.prisma.$transaction(async (tx) => {
      if (publicIds.length > 0) {
        await tx.cloudinaryDeletion.createMany({
          data: publicIds.map((publicId) => ({ publicId })),
        });
      }

      await tx.product.delete({
        where: { id },
      });
    });

    return { message: 'Product deleted successfully' };
  }
  private formatProduct(product: ProductWithRelations): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      sku: product.sku,

      images: product.images.map((image) => ({
        id: image.id,
        url: image.url,
        publicId: image.publicId,
        alt: image.alt,
        position: image.position,
      })),

      categoryId: product.categoryId,
      category: product.category?.name ?? null,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
