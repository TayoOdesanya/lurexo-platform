import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import type { Readable } from 'stream';
import type { FileStorage, StoredFileStream, UploadEventImageParams, UploadEventImageResult } from './file-storage.types';

@Injectable()
export class AzureBlobFileStorageService implements FileStorage {
  private readonly logger = new Logger(AzureBlobFileStorageService.name);

  private readonly container: ContainerClient;
  private readonly containerName: string;

  constructor() {
    const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER;

    if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING is missing');
    if (!containerName) throw new Error('AZURE_STORAGE_CONTAINER is missing');

    const blobServiceClient = BlobServiceClient.fromConnectionString(conn);
    this.container = blobServiceClient.getContainerClient(containerName);
    this.containerName = containerName;
  }

  private async ensureContainerExists() {
    // Public access is optional if we always serve via our API.
    // Keeping it as-is makes Azurite + basic testing easier.
    await this.container.createIfNotExists({ access: 'blob' });
  }

  private inferExtension(mimeType?: string, originalName?: string): string {
    const mt = (mimeType || '').toLowerCase();
    if (mt.includes('png')) return '.png';
    if (mt.includes('webp')) return '.webp';
    if (mt.includes('gif')) return '.gif';
    if (mt.includes('jpeg') || mt.includes('jpg')) return '.jpg';

    const fromName = extname(originalName || '').toLowerCase();
    if (fromName && fromName.length <= 10) return fromName;
    return '.jpg';
  }

  private buildEventImageKey(params: { organiserId: string; eventId: string; imageRole: string; ext: string }) {
    // organiser/event layout as requested
    // organisers/<organiserId>/events/<eventId>/<role>/<uuid>.<ext>
    const safeRole = (params.imageRole || 'hero').replace(/[^a-z0-9\-]/gi, '-');
    const fileName = `${randomUUID()}${params.ext}`;
    return `organisers/${params.organiserId}/events/${params.eventId}/${safeRole}/${fileName}`;
  }

  async uploadEventImage(params: UploadEventImageParams): Promise<UploadEventImageResult> {
    if (!params.organiserId) throw new BadRequestException('Missing organiserId');
    if (!params.eventId) throw new BadRequestException('Missing eventId');
    if (!params.fileBuffer?.length) throw new BadRequestException('Empty file');

    await this.ensureContainerExists();

    const ext = this.inferExtension(params.mimeType, params.originalName);
    const key = this.buildEventImageKey({
      organiserId: params.organiserId,
      eventId: params.eventId,
      imageRole: params.imageRole,
      ext,
    });

    const blockBlob = this.container.getBlockBlobClient(key);
    await blockBlob.uploadData(params.fileBuffer, {
      blobHTTPHeaders: {
        blobContentType: params.mimeType || 'image/jpeg',
        blobCacheControl: 'public, max-age=31536000, immutable',
      },
    });

    this.logger.debug(`Uploaded image key=${key} container=${this.containerName}`);
    return { key };
  }

  async getFileStream(key: string): Promise<StoredFileStream> {
    if (!key) throw new BadRequestException('Missing key');

    await this.ensureContainerExists();
    const blobClient = this.container.getBlobClient(key);
    const exists = await blobClient.exists();
    if (!exists) throw new NotFoundException('Image not found');

    const response = await blobClient.download();
    const stream = response.readableStreamBody as Readable | undefined;
    if (!stream) throw new NotFoundException('Image not found');

    return {
      stream,
      contentType: response.contentType || 'application/octet-stream',
      contentLength: response.contentLength,
      etag: response.etag,
      lastModified: response.lastModified,
      cacheControl: response.cacheControl || 'public, max-age=31536000, immutable',
    };
  }

  async deleteFile(key: string): Promise<void> {
    if (!key) return;
    await this.ensureContainerExists();
    await this.container.deleteBlob(key).catch(() => undefined);
  }
}
