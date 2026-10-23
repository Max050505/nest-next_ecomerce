import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
    description: 'Unique user identifier',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
    nullable: true,
  })
  firstName: string | null;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description: 'User role',
  })
  role: Role;

  @ApiProperty({
    example: '2026-09-17T12:00:00.000Z',
    description: 'Date when the user was created',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-09-17T12:30:00.000Z',
    description: 'Date when the user was last updated',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}

export class UsersPaginationMetaDto {
  @ApiProperty({ example: 35 })
  total: number;

  @ApiProperty({ example: 2 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 4 })
  totalPages: number;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty({ type: UsersPaginationMetaDto })
  meta: UsersPaginationMetaDto;
}