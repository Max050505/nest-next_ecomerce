
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class PaymentResponseDto {
  @ApiProperty({
    example: 'c7b7c7c8-1234-4567-8901-123456789abc',
  })
  id: string;

  @ApiProperty({
    example: 'a1b2c3d4-1234-4567-8901-123456789abc',
  })
  orderId: string;

  @ApiProperty({
    example: 99.99,
    description: 'Payment amount',
  })
  amount: number;

  @ApiProperty({
    example: 'a1b2c3d4-1234-4567-8901-123456789abc',
  })
  userId: string;

  @ApiProperty({
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
  })
  status: PaymentStatus;

  @ApiProperty({
    example: 'STRIPE',
    nullable: true,
  })
  paymentMethod: string | null;

  @ApiProperty({
    example: 'pi_123456789',
    nullable: true,
  })
  transactionId: string | null;

  @ApiProperty({
    example: '2026-09-26T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-09-26T10:35:00.000Z',
  })
  updatedAt: Date;
}

export class CreatePaymentIntentApiResponseDto {
  @ApiProperty({
    example: 'pi_secret_xxxxxxxxx',
    description: 'Stripe client secret used to confirm the payment on the client',
  })
  clientSecret: string;

  @ApiProperty({
    example: 'c7b7c7c8-1234-4567-8901-123456789abc',
    description: 'Created payment ID',
  })
  paymentId: string;
}

export class PaymentApiResponseDto {
  @ApiProperty({
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: PaymentResponseDto,
  })
  data: PaymentResponseDto;

  @ApiProperty({
    example: 'Payment retrieved successfully',
    required: false,
    nullable: true,
  })
  message?: string;
}
