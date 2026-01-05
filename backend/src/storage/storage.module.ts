import { Module } from '@nestjs/common';
import { BlobStorageService } from './blob-storage.service';

@Module({
  providers: [BlobStorageService],
  exports: [BlobStorageService], // 👈 important so other modules can use it
})
export class StorageModule {}
