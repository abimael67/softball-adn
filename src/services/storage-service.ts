const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, "") + "/functions/v1";

export class StorageService {
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.bucketName = import.meta.env.VITE_R2_BUCKET_NAME;
    this.publicUrl = import.meta.env.VITE_R2_PUBLIC_URL;

    if (!this.bucketName || !this.publicUrl) {
      throw new Error("Missing R2 environment variables");
    }
  }

  async upload(file: File, path: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    const response = await fetch(`${FUNCTIONS_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to upload file: ${err}`);
    }

    const data = await response.json();
    return data.key;
  }

  async delete(key: string): Promise<void> {
    const response = await fetch(`${FUNCTIONS_URL}/delete?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to delete file: ${err}`);
    }
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }

  validateImage(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Tipo de archivo no válido. Use JPEG, PNG, WebP o HEIC.",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "El archivo es demasiado grande. Máximo 10MB.",
      };
    }

    return { valid: true };
  }
}

export const storageService = new StorageService();
