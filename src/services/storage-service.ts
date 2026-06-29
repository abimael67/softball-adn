import { supabase } from "@/lib/supabase";

export class StorageService {
  private bucketName: string;
  private publicUrl: string;
  private workerUrl: string;

  constructor() {
    this.bucketName = import.meta.env.VITE_R2_BUCKET_NAME;
    this.publicUrl = import.meta.env.VITE_R2_PUBLIC_URL;
    this.workerUrl = import.meta.env.VITE_WORKER_URL;

    if (!this.bucketName || !this.publicUrl) {
      throw new Error("Missing R2 environment variables");
    }

    if (!this.workerUrl) {
      throw new Error("Missing VITE_WORKER_URL environment variable");
    }
  }

  private async getAuthToken(): Promise<string> {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.access_token) {
      throw new Error("Not authenticated");
    }
    return data.session.access_token;
  }

  async upload(file: File, path: string): Promise<string> {
    const token = await this.getAuthToken();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    const response = await fetch(`${this.workerUrl}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: { message: "Upload failed" } }));
      throw new Error(err.error?.message || "Failed to upload file");
    }

    const data = await response.json();
    return data.data.key;
  }

  async delete(key: string): Promise<void> {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.workerUrl}/upload?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: { message: "Delete failed" } }));
      throw new Error(err.error?.message || "Failed to delete file");
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
