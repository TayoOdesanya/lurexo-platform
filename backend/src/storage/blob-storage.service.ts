import { Injectable } from '@nestjs/common';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { randomUUID } from 'crypto';

@Injectable()
export class BlobStorageService {
  private readonly container: ContainerClient;
  private readonly publicBaseUrl: string;
  private readonly containerName: string;

  constructor() {
    const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER;
    const publicBaseUrl = process.env.AZURE_STORAGE_PUBLIC_BASE_URL;

    if (!conn) throw new Error('Missing AZURE_STORAGE_CONNECTION_STRING');
    if (!containerName) throw new Error('Missing AZURE_STORAGE_CONTAINER');
    if (!publicBaseUrl) throw new Error('Missing AZURE_STORAGE_PUBLIC_BASE_URL');

    const blobServiceClient = BlobServiceClient.fromConnectionString(conn);
    this.container = blobServiceClient.getContainerClient(containerName);

    this.publicBaseUrl = publicBaseUrl.replace(/\/$/, '');
    this.containerName = containerName;
  }

  private async ensureContainerExists() {
    await this.container.createIfNotExists({ access: 'blob' }); // public read for blobs
  }

  private inferExtension(mimeType?: string, originalName?: string) {
    // basic mapping, expand as you need
    const mt = (mimeType || '').toLowerCase();
    if (mt.includes('png')) return 'png';
    if (mt.includes('webp')) return 'webp';
    if (mt.includes('jpeg') || mt.includes('jpg')) return 'jpg';

    const name = (originalName || '').toLowerCase();
    const m = name.match(/\.(png|webp|jpe?g)$/);
    return m?.[1] === 'jpeg' ? 'jpg' : (m?.[1] ?? 'jpg');
  }

  async uploadEventCoverImage(params: {
    organiserId: string;
    fileBuffer: Buffer;
    mimeType?: string;
    originalName?: string;
  }): Promise<{ blobPath: string; publicUrl: string }> {
    await this.ensureContainerExists();

    const ext = this.inferExtension(params.mimeType, params.originalName);
    const blobPath = `events/${params.organiserId}/${randomUUID()}.${ext}`;

    const blockBlob = this.container.getBlockBlobClient(blobPath);

    await blockBlob.uploadData(params.fileBuffer, {
      blobHTTPHeaders: {
        blobContentType: params.mimeType || 'image/jpeg',
        // Optional caching:
        blobCacheControl: 'public, max-age=31536000, immutable',
      },
    });

    const publicUrl = `${this.publicBaseUrl}/${this.containerName}/${blobPath}`;
    return { blobPath, publicUrl };
  }
}
