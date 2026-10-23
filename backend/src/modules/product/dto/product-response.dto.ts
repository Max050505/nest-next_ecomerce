import { ApiProperty } from '@nestjs/swagger';

export class ProductImageResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/products/iphone.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Cloudinary public ID of the image',
    example: 'products/iphone_front',
  })
  publicId: string;

  @ApiProperty({
    example: 'iPhone 15 front view',
    nullable: true,
  })
  alt: string | null;

  @ApiProperty({
    example: 0,
  })
  position: number;
}

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product id',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Wireless headphones',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High quality wireless headphones',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Product price',
    example: 99.99,
  })
  price: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 100,
  })
  stock: number;

  @ApiProperty({
    description: 'Product SKU',
    example: 'WH-001',
  })
  sku: string;

  @ApiProperty({
    description: 'Product images',
    type: [ProductImageResponseDto],
  })
  images: ProductImageResponseDto[];

  @ApiProperty({
    description: 'Product category id',
    example: 'cf210221-aeeb-476e-81a3-b90249cdf2c0',
    nullable: true,
  })
  category: string | null;

  @ApiProperty({
    description: 'Product category id',
    example: 'cf210221-aeeb-476e-81a3-b90249cdf2c0',
    nullable: true,
  })
  categoryId: string | null;

  @ApiProperty({
    description: 'Whether product is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
