export const AVATAR_BUCKET = "student-avatars";
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function avatarFileError(file: Pick<File, "size" | "type">): string | null {
  if (!IMAGE_TYPES.has(file.type)) return "Elige una imagen JPG, PNG o WebP.";
  if (file.size === 0 || file.size > MAX_AVATAR_BYTES) return "La imagen debe ocupar como máximo 5 MB y no estar vacía.";
  return null;
}

export function avatarPath(userId: string, imageId: string): string {
  return `${userId}/${imageId}.jpg`;
}

/** Resize and re-encode in the browser: no original location/EXIF metadata is uploaded. */
export async function prepareAvatar(file: File): Promise<Blob> {
  const error = avatarFileError(file);
  if (error) throw new Error(error);
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo preparar la imagen.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("No se pudo preparar la imagen.")), "image/jpeg", 0.85);
    });
  } finally {
    bitmap.close();
  }
}