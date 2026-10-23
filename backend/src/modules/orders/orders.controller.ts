import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import {
  ModerateThrottler,
  RelaxedThrottler,
} from '../../common/decorators/custom-throttler.decorator.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { GetUser } from '../../common/decorators/get-user.decorator.js';
import {
  OrderApiResponseDto,
  OrderResponseDto,
  PaginatedOrderResponseDto,
} from './dto/order-response.sto.js';
import { Roles } from '../users/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
import { QueryOrderDto } from './dto/query-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ModerateThrottler()
  @ApiOperation({
    summary: 'Create a new order',
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiCreatedResponse({
    description: 'The order created successfully',
    type: OrderApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'invalid data or insufficient stock',
  })
  @ApiNotFoundResponse({
    description: 'cart not faound or empty',
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests - rate limit exceeded',
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('id') userId: string,
  ) {
    this.ordersService.create(userId, createOrderDto);
  }

  @Get('admin/all')
  @Roles(Role.ADMIN)
  @RelaxedThrottler()
  @ApiOperation({ summary: '[ADMIN Get all arders (paginated)]' })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiResponse({
    description: 'list of orders',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(OrderResponseDto) },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'admin access required',
  })
  async findAllOrdersForAdmin(@Query() query: QueryOrderDto) {
    this.ordersService.findAllOrdersForAdmin(query);
  }

  @Get()
  @RelaxedThrottler()
  @ApiOperation({ summary: 'get all orders for current user(pagination)' })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiOkResponse({
    description: 'List of user orders',
    type: PaginatedOrderResponseDto,
  })
  async findAll(@Query() query: QueryOrderDto, @GetUser('id') userId: string) {
    return await this.ordersService.findAll(query, userId);
  }

  @Get('admin/:id')
  @RelaxedThrottler()
  @ApiOperation({ summary: '[ADMIN Get order by id]' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiOkResponse({
    description: 'Order details',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  async findOneAdmin(@Param('id') id: string) {
    return await this.ordersService.findOne(id);
  }

  @Get(':id')
  @RelaxedThrottler()
  @ApiOperation({ summary: 'get order by id for current user' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiOkResponse({
    description: 'Order details',
    type: OrderApiResponseDto,
  })
  async findOneUser(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.ordersService.findOne(id, userId);
  }

  @Patch('admin/:id')
  @Roles(Role.ADMIN)
  @ModerateThrottler()
  @ApiOperation({
    summary: '[Admin] update any order',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({
    description: 'Order updated successfully',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  async updateAdmin(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Patch(':id')
  @ModerateThrottler()
  @ApiOperation({ summary: 'ipdate order by id for current user' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({
    description: 'Order details',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Order not found' })
  async update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, dto, userId);
  }

  @Delete('admin/:id')
  @Roles(Role.ADMIN)
  @ModerateThrottler()
  @ApiOperation({
    summary: '[Admin] cancel order by ID',
  })
  @ApiOkResponse({
    description: 'Order canceled successfully',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  async cancelAdmin(@Param('id') id: string) {
    return await this.ordersService.cancel(id);
  }

  @Delete(':id')
  @ModerateThrottler()
  @ApiOperation({
    summary: 'cancel order by ID',
  })
  @ApiOkResponse({
    description: 'Order canceled successfully',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  async cancelUser(@Param('id') id: string, @GetUser('id') userId: string) {
    return await this.ordersService.cancel(id, userId);
  }
}
