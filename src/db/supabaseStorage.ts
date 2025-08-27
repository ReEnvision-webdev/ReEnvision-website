import { createClient } from "@supabase/supabase-js";
import cuid from "cuid";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!url || !serviceKey) {
  throw new Error(
    "Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
}

const client = createClient(url, serviceKey);

export interface UploadResult {
  bucket: string;
  path: string;
  contentType: string;
}

export const uploadImage = async (
  file: File,
  bucket: string,
): Promise<string> => {
  if (!file) {
    throw new Error("No file provided");
  }

  const bytes = await file.arrayBuffer();

  const filename = `${cuid()}.jpg`;
  const path = `${filename}`;

  const { error: uploadErr } = await client.storage
    .from(bucket)
    .upload(path, Buffer.from(bytes), {
      contentType: file.type,
      upsert: false,
    });

  if (uploadErr) {
    throw new Error(`Upload failed: ${uploadErr.message}`);
  }

  return getImageUrl(path, bucket);
};

export const getImageUrl = (path: string, bucket: string): string => {
  if (!path) {
    throw new Error("Path is required");
  }

  const { data } = client.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
};

/**
 * Delete an object by path.
 *
 * @param path The object's path within the bucket.
 * @param bucket Storage bucket (default "events").
 */
export const deleteImage = async (
  path: string,
  bucket: string,
): Promise<void> => {
  if (!path) {
    throw new Error("Path is required");
  }

  const { error } = await client.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};
