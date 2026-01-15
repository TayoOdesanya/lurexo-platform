import { Module } from '@nestjs/common';
import { AzureBlobFileStorageService } from './azure-blob-file-storage.service';
import { ImagesController } from './images.controller';
import { FILE_STORAGE } from './file-storage.types';

@Module({
  controllers: [ImagesController],
  providers: [
    AzureBlobFileStorageService,
    {
      provide: FILE_STORAGE,
      useExisting: AzureBlobFileStorageService,
    },
  ],
  exports: [FILE_STORAGE],
})
export class StorageModule {}
