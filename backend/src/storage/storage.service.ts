import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  private readonly blobServiceClient: BlobServiceClient;
  private readonly containerName: string;
  private readonly publicBaseUrl: string;

  constructor() {
    const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const container = process.env.AZURE_STORAGE_CONTAINER;
    const baseUrl = process.env.AZURE_STORAGE_PUBLIC_BASE_URL;

    if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING is missing');
    if (!container) throw new Error('AZURE_STORAGE_CONTAINER is missing');
    if (!baseUrl) throw new Error('AZURE_STORAGE_PUBLIC_BASE_URL is missing');

    this.blobServiceClient = BlobServiceClient.fromConnectionString(conn);
    this.containerName = container;

    // Must be base account url, NOT including container name
    // e.g. http://127.0.0.1:10000/devstoreaccount1
    this.publicBaseUrl = baseUrl.replace(/\/+$/, '');
  }

  private async ensureContainer() {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    await containerClient.createIfNotExists({ access: 'blob' }); // public read
    return containerClient;
  }

  async uploadEventCoverImage(
    organiserId: string,
    file: Express.Multer.File,
  ): Promise<{ url: string; blobName: string }> {
    if (!file) throw new BadRequestException('No file provided');
    if (!file.buffer?.length) throw new BadRequestException('Empty file buffer');
    if (!organiserId) throw new BadRequestException('Missing organiserId');

    const containerClient = await this.ensureContainer();

    // Preserve extension if present; default to .jpg
    const originalExt = extname(file.originalname ?? '').toLowerCase();
    const safeExt =
      originalExt && originalExt.length <= 10 ? originalExt : '.jpg';

    const filename = `${randomUUID()}${safeExt}`;

    // Keep images organized
    const blobName = `events/${organiserId}/${filename}`;

    const blobClient = containerClient.getBlockBlobClient(blobName);

    await blobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype || 'image/jpeg',
      },
    });

    // Public URL (Azurite-compatible) = baseUrl + container + blobName
    const url = `${this.publicBaseUrl}/${this.containerName}/${blobName}`;

    this.logger.debug(`Uploaded cover image: ${blobName}`);

    return { url, blobName };
  }
}
