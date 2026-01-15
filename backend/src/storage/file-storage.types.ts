// backend/src/storage/file-storage.types.ts

import type { Readable } from 'stream';

/**
 * Nest can't inject TypeScript interfaces, so we use a string token.
 * Consumers should `@Inject(FILE_STORAGE)`.
 */
export const FILE_STORAGE = 'FILE_STORAGE';

export type UploadEventImageParams = {
  organiserId: string;
  eventId: string;
  /** e.g. 'hero' | 'alt-1' | 'alt-2' | 'alt-3' */
  imageRole: string;
  fileBuffer: Buffer;
  mimeType?: string;
  originalName?: string;
};

export type UploadEventImageResult = {
  /** Provider-neutral storage key/path (e.g. organisers/<id>/events/<id>/hero/<uuid>.jpg) */
  key: string;
};

export type StoredFileStream = {
  stream: Readable;
  contentType: string;
  contentLength?: number;
  etag?: string;
  lastModified?: Date;
  cacheControl?: string;
};

export interface FileStorage {
  uploadEventImage(params: UploadEventImageParams): Promise<UploadEventImageResult>;
  getFileStream(key: string): Promise<StoredFileStream>;
  deleteFile(key: string): Promise<void>;
}
