import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
export class CreateProductImageDto {
  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/products/iphone.jpg',
  })
  @IsString()
  @IsUrl()
  url: string;

  @ApiProperty({
    example: 'products/iphone_abc123',
  })
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @ApiProperty({ required: false, example: 'Wireless headphones' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt?: string;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless headphones',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Description about the product',
    example: 'High quality  Wireless headphones ',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product price (USD)',
    example: 99.99,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Stock keeping Unit(sku) - unique identifier',
    example: 'WH-001',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku: string;

  @ApiProperty({
    type: CreateProductImageDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];

  @ApiProperty({
    description: 'Product category',
    example: 'cf210221-aeeb-476e-81a3-b90249cdf2c0',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Whether product is available to purchase',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
