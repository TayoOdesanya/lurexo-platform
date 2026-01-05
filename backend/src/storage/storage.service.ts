// C:\Dev\lurexo\backend\src\storage\storage.service.ts
import { Injectable } from '@nestjs/common';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { randomUUID } from 'crypto';
import path from 'path';

@Injectable()
export class StorageService {
  private readonly containerName: string;
  private readonly containerClient: ContainerClient;
  private readonly publicBaseUrl?: string; // optional override for local/azure

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is missing');
    }

    this.containerName = process.env.AZURE_STORAGE_CONTAINER || 'events';
    this.publicBaseUrl = process.env.AZURE_STORAGE_PUBLIC_BASE_URL; // optional

    const blobService = BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = blobService.getContainerClient(this.containerName);
  }

  async ensureContainerExists() {
    await this.containerClient.createIfNotExists({
      access: 'blob', // public read (good for event images)
    });
  }

  /**
   * Uploads a file and returns a public URL.
   * organizerId is used to prefix path: events/<organizerId>/<uuid>.jpg
   */
  async uploadEventImage(file: Express.Multer.File, organizerId: string) {
    await this.ensureContainerExists();

    const ext = this.safeExt(file.originalname, file.mimetype);
    const blobName = `events/${organizerId}/${randomUUID()}${ext}`;

    const blockBlob = this.containerClient.getBlockBlobClient(blobName);

    await blockBlob.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype || 'application/octet-stream',
      },
    });

    // For Azurite you may want to override the base URL because the SDK url is fine,
    // but sometimes people prefer a stable base.
    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl.replace(/\/$/, '')}/${this.containerName}/${blobName}`;
    }

    return blockBlob.url;
  }

  private safeExt(originalName: string, mime?: string) {
    // prefer original extension, fallback from mime
    const ext = path.extname(originalName || '').toLowerCase();
    if (ext && ext.length <= 10) return ext;

    if (mime === 'image/jpeg') return '.jpg';
    if (mime === 'image/png') return '.png';
    if (mime === 'image/webp') return '.webp';
    return '';
  }
}
