import { api } from "@/lib/api";

interface CloudinarySignature {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

export async function uploadImage(
  file: File,
  folder: "products" | "categories",
): Promise<{
  url: string;
  publicId: string;
}> {
  const endpoint =
    folder === "categories"
      ? "/categories/upload-signature"
      : "/products/upload-signature";

  const response = await api.get<CloudinarySignature>(endpoint);

  const data = response.data;

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", data.apiKey);
  formData.append("timestamp", String(data.timestamp));
  formData.append("signature", data.signature);
  formData.append("folder", data.folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const result: CloudinaryUploadResponse = await uploadResponse.json();

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}
export async function deleteCategoryImage(publicId: string): Promise<void> {
  await api.delete("/categories/image", {
    data: { publicId },
  });
}
