import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from './services/cloudinary.service.js';

@Injectable()
export class CloudinaryDeletionWorker {
  private readonly logger = new Logger(CloudinaryDeletionWorker.name);
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @Cron('*/30 * * * * *')
  async processPendingDeletions(): Promise<void> {
    // Не запускаємо паралельний цикл в одному екземплярі сервісу.
    if (this.running) return;

    this.running = true;

    try {
      const jobs = await this.prisma.cloudinaryDeletion.findMany({
        where: {
          processedAt: null,
          nextAttemptAt: { lte: new Date() },
        },
        orderBy: { createdAt: 'asc' },
        take: 20,
      });

      for (const job of jobs) {
        try {
          await this.cloudinary.deleteImage(job.publicId);

          await this.prisma.cloudinaryDeletion.update({
            where: { id: job.id },
            data: { processedAt: new Date(), lastError: null },
          });
        } catch (error) {
          const attempts = job.attempts + 1;
          const delaySeconds = Math.min(
            3600,
            30 * 2 ** Math.min(attempts - 1, 7),
          );

          await this.prisma.cloudinaryDeletion.update({
            where: { id: job.id },
            data: {
              attempts,
              nextAttemptAt: new Date(
                Date.now() + delaySeconds * 1000,
              ),
              lastError:
                error instanceof Error
                  ? error.message
                  : String(error),
            },
          });

          this.logger.error(
            `Failed to delete Cloudinary image ${job.publicId}; attempt ${attempts}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        'Failed to process Cloudinary deletion queue',
        error instanceof Error ? error.stack : String(error),
      );
    } finally {
      this.running = false;
    }
  }
}