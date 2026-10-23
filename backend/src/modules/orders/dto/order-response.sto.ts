import { ApiProperty } from '@nestjs/swagger';

export class OrderApiResponseDto<T> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Returned data',
    type: Object,
  })
  data: T;

  @ApiProperty({
    description: 'Optional response message',
    nullable: true,
    required: false,
    example: null,
  })
  message?: string;
}

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'Order item ID',
    example: 'clx123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Product ID',
    example: 'clx987654321',
  })
  productId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Headphones',
  })
  productName: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Price of one product at the time of purchase',
    example: 39.99,
  })
  price: number;

  @ApiProperty({
    description: 'Total price for this order item',
    example: 79.98,
  })
  subtotal: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'Order ID',
    example: 'clx123456789',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'clx987654321',
  })
  userId: string;

  @ApiProperty({
    description: 'Order status',
    example: 'PENDING',
  })
  status: string;

  @ApiProperty({
    description: 'Total order amount',
    example: 119.97,
  })
  total: number;

  @ApiProperty({
    description: 'Shipping address',
    example: 'Shevchenka Street 10, Lviv, Ukraine',
  })
  shippingAddress: string;

  @ApiProperty({
    type: [OrderItemResponseDto],
    description: 'Products included in the order',
  })
  items: OrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginatedOrderResponseDto {
  @ApiProperty({ type: OrderResponseDto })
  data: OrderResponseDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  total: number;
  
  @ApiProperty()
  limit: number;
}
