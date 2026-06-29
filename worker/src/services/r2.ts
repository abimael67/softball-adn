import type { Env } from "../types";
import { logger } from "../utils/logger";

export class R2Service {
  constructor(private bucket: R2Bucket) {}

  async upload(key: string, body: ReadableStream | ArrayBuffer | Uint8Array, contentType: string): Promise<void> {
    logger.info("Uploading to R2", { key, contentType });

    await this.bucket.put(key, body, {
      httpMetadata: { contentType },
    });
  }

  async delete(key: string): Promise<void> {
    logger.info("Deleting from R2", { key });
    await this.bucket.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    const object = await this.bucket.head(key);
    return object !== null;
  }
}

export function createR2Service(env: Env): R2Service {
  return new R2Service(env.BUCKET);
}
