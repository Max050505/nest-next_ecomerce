import { ApiProperty } from '@nestjs/swagger';

export class ResponseCategoryDto {
  @ApiProperty({
    example: '550e-4402....',
    description: 'the unique identifire of the category',
  })
  id: string;

  @ApiProperty({ example: 'electronics', description: 'the name of category' })
  name: string;

  @ApiProperty({
    example: 'devices and gadgets',
    description: ' a brief of the category',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 'electronics',
    description: 'The URL-friendly slug for category',
    nullable: true,
  })
  slug: string | null;

  @ApiProperty({
    example: 'http://exmale.com/images/image.png',
    description: 'url of the category image',
    nullable: true,
  })
  imageUrl: string | null;

  imagePublicId: string | null;

  @ApiProperty({
    example: true,
    description: 'indicate if the category is active',
  })
  isActive: boolean;

  @ApiProperty({
    example: 200,
    description: 'count of the product in this category',
  })
  productCount: number;

  @ApiProperty({
    example: '2024-01-01T1212:00:00Z',
    description: 'date and time when the category was created',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2024-01-01T1212:00:00Z',
    description: 'date and time when the category was updated',
  })
  updatedAt: Date;
}
