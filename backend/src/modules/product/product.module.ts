import { Module } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { CloudinaryModule } from '../../common/services/cloudinary.module.js';
import { CloudinaryDeletionWorker } from '../../common/cloudinary-deletion.worker.js';

@Module({
  imports: [CloudinaryModule],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryDeletionWorker],
})
export class ProductModule {}
