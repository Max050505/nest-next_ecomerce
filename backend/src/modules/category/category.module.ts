import { Module } from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CategoryController } from './category.controller.js';
import { CloudinaryModule } from '../../common/services/cloudinary.module.js';
import { CloudinaryDeletionWorker } from '../../common/cloudinary-deletion.worker.js';

@Module({
  imports: [CloudinaryModule],
  controllers: [CategoryController],
  providers: [CategoryService, CloudinaryDeletionWorker],
})
export class CategoryModule {}
