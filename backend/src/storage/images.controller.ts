import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { Inject } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { FILE_STORAGE, type FileStorage } from './file-storage.types';

@Controller('images')
export class ImagesController {
  constructor(@Inject(FILE_STORAGE) private readonly storage: FileStorage) {}

  /**
   * Provider-neutral image endpoint.
   * Frontend should use: `${API_BASE_URL}/images?key=<storageKey>`
   */
  @Public()
  @Get()
  async getImage(
    @Query('key') key: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!key) throw new BadRequestException('Query parameter "key" is required');

    const file = await this.storage.getFileStream(key);

    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
    if (file.contentLength) res.setHeader('Content-Length', String(file.contentLength));
    if (file.etag) res.setHeader('ETag', file.etag);
    if (file.lastModified) res.setHeader('Last-Modified', file.lastModified.toUTCString());
    res.setHeader('Cache-Control', file.cacheControl || 'public, max-age=31536000, immutable');

    return new StreamableFile(file.stream);
  }
}
