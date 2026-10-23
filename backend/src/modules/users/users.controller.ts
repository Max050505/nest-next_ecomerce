import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { Query } from '@nestjs/common';
import { QueryUsersDto } from './dto/query-user.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PaginatedUsersResponseDto,
  UserResponseDto,
} from './dto/users-responce.dto.js';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface.js';
import { Roles } from './decorators/roles.decorator.js';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { GetUser } from '../../common/decorators/get-user.decorator.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiOperation({ summary: 'get current user profile' })
  async getProfile(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    return await this.usersService.findOne(req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Returns all registered users. Available only for administrators.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: UserResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Administrator role is required.',
  })
  async getAllProfiles(
    @Query() dto: QueryUsersDto,
  ): Promise<PaginatedUsersResponseDto> {
    return this.usersService.findAll(dto);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update current user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile successfully updated',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, dto);
  }

  @Patch('me/password')
  async changerPassword(
    @GetUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return await this.usersService.changePassword(userId, dto);
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update user role' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateRole(id, dto.role);
  }

  @Delete('me')
  async deleteAccount(
    @GetUser('id') userId: string,
  ): Promise<{ message: string }> {
    return await this.usersService.remove(userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(
    @Param('id') id: string,
    @GetUser('id') requesterId: string,
  ): Promise<{ message: string }> {
    return this.usersService.remove(id, requesterId);
  }
}
