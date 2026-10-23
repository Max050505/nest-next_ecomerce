import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { UserResponseDto } from './dto/users-responce.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { QueryUsersDto } from './dto/query-user.dto.js';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  private readonly SALT_ROUNDS = 10;
  async findOne(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(dto: QueryUsersDto): Promise<{
    data: UserResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const { page = 1, limit = 10, search, role } = dto;

    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role;
    }

    const term = search?.trim();

    if (term) {
      where.OR = [
        {
          firstName: {
            contains: term,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: term,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: term,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),

      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email) {
      const emailTaken = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          NOT: { id },
        },
        select: { id: true },
      });

      if (emailTaken) {
        throw new ConflictException('Email already taken');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateRole(id: string, role: Role): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const { currentPassword, newPassword } = dto;
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPassValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPassValid) {
      throw new NotFoundException('password is incorrect');
    }

    const isSamePass = await bcrypt.compare(newPassword, user.password);

    if (isSamePass) {
      throw new NotFoundException('New password must be different');
    }

    const hashPass = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: id },
      data: { password: hashPass },
    });

    return { message: 'Password changed successfully!' };
  }

  async remove(id: string, requesterId?: string): Promise<{ message: string }> {
    // Забороняємо адміністратору видаляти себе через admin endpoint.
    if (requesterId && id === requesterId) {
      throw new ForbiddenException(
        'You cannot delete your own account from the admin panel',
      );
    }

    try {
      return await this.prisma.$transaction(
        async (tx) => {
          const user = await tx.user.findUnique({
            where: { id },
            select: { role: true },
          });

          if (!user) {
            throw new NotFoundException('User not found');
          }

          // Захист від видалення останнього адміністратора.
          if (user.role === Role.ADMIN) {
            const adminCount = await tx.user.count({
              where: { role: Role.ADMIN },
            });

            if (adminCount <= 1) {
              throw new ForbiddenException(
                'Cannot delete the last administrator',
              );
            }
          }

          await tx.user.delete({
            where: { id },
          });

          return user.role === Role.ADMIN
            ? { message: 'User removed successfully!' }
            : { message: 'Account removed successfully!' };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      // Serializable-транзакція може конфліктувати з паралельним видаленням.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034'
      ) {
        throw new ConflictException(
          'Concurrent modification detected. Please try again.',
        );
      }

      throw error;
    }
  }
}
