import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { AuthResponseDto } from './dto/authResponse.dto.js';
import { LoginDto } from './dto/login.dto.js';

import { GetUser } from '../../common/decorators/get-user.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RefreshTokenGuard } from './guards/refresh_token.guard.js';

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 15 * 60 * 1000,
  path: '/',
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account and returns JWT tokens.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid registration data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this email already exists',
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: AuthResponseDto['user'] }> {
    const result = await this.authService.userRegister(registerDto);

    response.cookie(
      'accessToken',
      result.accessToken,
      accessTokenCookieOptions,
    );

    response.cookie(
      'refreshToken',
      result.refreshToken,
      refreshTokenCookieOptions,
    );

    return {
      user: result.user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticates a user and returns JWT tokens.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid email or password',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid login data',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: AuthResponseDto['user'] }> {
    const result = await this.authService.login(loginDto);
       response.cookie(
      'accessToken',
      result.accessToken,
      accessTokenCookieOptions,
    );

    response.cookie(
      'refreshToken',
      result.refreshToken,
      refreshTokenCookieOptions,
    );

    return { user: result.user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('Refresh-JWT')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generates new JWT tokens using a valid refresh token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens successfully refreshed',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired refresh token',
  })
  async refresh(@GetUser('id') userId: string, @Res({ passthrough: true }) response: Response,): Promise<{ user: AuthResponseDto['user'] }> {
        const result =
      await this.authService.refreshToken(userId);

    response.cookie(
      'accessToken',
      result.accessToken,
      accessTokenCookieOptions,
    );

    response.cookie(
      'refreshToken',
      result.refreshToken,
      refreshTokenCookieOptions,
    );

    return {
      user: result.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT auth')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Logs out the currently authenticated user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged out',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired access token',
  })
  async logout(@GetUser('id') userId: string, @Res({ passthrough: true }) response: Response): Promise<{ message: string }> {
    await this.authService.logout(userId);

    response.clearCookie(
      'accessToken',
      accessTokenCookieOptions,
    );

    response.clearCookie(
      'refreshToken',
      refreshTokenCookieOptions,
    );

    return {
      message: 'Successfully logged out',
    };
  }
}
