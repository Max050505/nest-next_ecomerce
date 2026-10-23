import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('db successfully connected');

  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('db disconnected');
  }

  // async cleanDatabase() {
  //   if (process.env.NODE_ENV === 'production') {
  //     throw new Error('Cannot clean database on production mode');
  //   }

  //   const models = Reflect.ownKeys(this).filter(
  //     (key) => typeof key === 'string' && !key.startsWith('_'),
  //   );

  //   return Promise.all(
  //     models.map((modelKey) => {
  //       if (typeof modelKey === 'string') return this[modelKey].deleteMany;
  //     }),
  //   );
  // }
}
