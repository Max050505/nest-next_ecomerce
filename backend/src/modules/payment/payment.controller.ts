import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import {
  CreatePaymentIntentApiResponseDto,
  PaymentApiResponseDto,
} from './dto/payment-response.dto.js';
import { GetUser } from '../../common/decorators/get-user.decorator.js';
import { СreatePaymentIntentDto } from './dto/create-payment.dto.js';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto.js';

@Controller('payments')
@ApiTags('payments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post('create-intent')
  @ApiOperation({
    summary: 'create payment intent',
    description: 'Create payment intent for orders',
  })
  @ApiCreatedResponse({
    description: 'Payment intent created',
    type: CreatePaymentIntentApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'invalid data or order not found',
  })
  async createPaymentIntent(
    @Body()
    createPaymentIntentDto: СreatePaymentIntentDto,
    @GetUser('id') userId: string,
  ) {
    return await this.paymentService.createPaymentIntent(
      createPaymentIntentDto,
      userId,
    );
  }

  @Post('confirm')
  @ApiOperation({
    summary: 'Confirm payment',
    description: 'Confirm a payment intent for an order',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment confirmed',
    type: PaymentApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Payment not found or already comleted',
  })
  async confirmPayment(
    @Body() confirmPaymentDto: ConfirmPaymentDto,
    @GetUser('id') userId: string,
  ) {
    return this.paymentService.confirmPayment(confirmPaymentDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all payments',
    description: 'Get all payments for the current user',
  })
  @ApiOkResponse({
    description: 'Payment retrieved',
    type: PaymentApiResponseDto,
  })
  async findAll(@GetUser('id') userId: string) {
    return this.paymentService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get payment by ID',
    description: 'Returns a payment belonging to the current user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    example: 'c7b7c7c8-1234-4567-8901-123456789abc',
  })
  @ApiOkResponse({
    description: 'Payment successfully retrieved',
    type: PaymentApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid payment ID',
  })
  async findOne(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return await this.paymentService.findOne(id, userId);
  }

  @Get('order/:orderId')
  @ApiOperation({
    summary: 'Get payment by order ID',
    description: 'Returns the payment associated with the specified order.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
    example: 'a1b2c3d4-1234-4567-8901-123456789abc',
  })
  @ApiOkResponse({
    description: 'Payment successfully retrieved',
    type: PaymentApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Payment or order not found',
  })
  async findByOrder(
    @Param('orderId') orderId: string,
    @GetUser('id') userId: string,
  ) {
    return this.paymentService.findByOrder(orderId, userId);
  }
}
