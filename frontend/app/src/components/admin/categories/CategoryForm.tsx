
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { uploadImage } from "@/services/cloudinary.service";
import {
  useCategory,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/use-categories";
import { slugify } from "@/utils/slugify";

interface CategoryFormProps {
  mode: "create" | "edit";
  categoryId?: string;
}

export function CategoryForm({
  mode,
  categoryId,
}: CategoryFormProps) {
  const router = useRouter();

  const category = useCategory(
    mode === "edit" ? categoryId ?? "" : "",
  );

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "edit" || !category.data) return;

    setName(category.data.name);
    setDescription(category.data.description ?? "");
    setIsActive(category.data.isActive);
    setImageUrl(category.data.imageUrl ?? "");
    setImagePublicId(category.data.imagePublicId ?? "");
  }, [mode, category.data]);

  const slug = slugify(name);

  const isSubmitting =
    isUploading ||
    createCategory.isPending ||
    updateCategory.isPending;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    if (mode === "edit" && !categoryId) {
      setError("Category ID is missing.");
      return;
    }

    try {
      let nextImageUrl = imageUrl;
      let nextImagePublicId = imagePublicId;

      if (image) {
        setIsUploading(true);

        const uploadedImage = await uploadImage(
          image,
          "categories",
        );

        nextImageUrl = uploadedImage.url;
        nextImagePublicId = uploadedImage.publicId;
      }

      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        slug: slug || undefined,
        imageUrl: nextImageUrl || undefined,
        imagePublicId: nextImagePublicId || undefined,
        isActive,
      };

      if (mode === "edit") {
        await updateCategory.mutateAsync({
          id: categoryId!,
          payload,
        });
      } else {
        await createCategory.mutateAsync(payload);
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (submitError: unknown) {
      let message =
        mode === "edit"
          ? "Failed to update category."
          : "Failed to create category.";

      if (axios.isAxiosError(submitError)) {
        const apiMessage = submitError.response?.data?.message;

        if (Array.isArray(apiMessage)) {
          message = apiMessage.join(", ");
        } else if (typeof apiMessage === "string") {
          message = apiMessage;
        }
      } else if (submitError instanceof Error) {
        message = submitError.message;
      }

      setError(message);
    } finally {
      setIsUploading(false);
    }
  }

  if (mode === "edit" && category.isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading category...
        </p>
      </div>
    );
  }

  if (mode === "edit" && category.isError) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-6"
      >
        <p className="text-sm text-red-600">
          Failed to load category.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6"
    >
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="category-name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>

        <input
          id="category-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={100}
          disabled={isSubmitting}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 disabled:bg-gray-50"
          placeholder="Electronics"
        />
      </div>

      <div>
        <label
          htmlFor="category-description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="category-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={255}
          rows={4}
          disabled={isSubmitting}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 disabled:bg-gray-50"
          placeholder="Category description..."
        />
      </div>

      <div>
        <label
          htmlFor="category-slug"
          className="block text-sm font-medium text-gray-700"
        >
          Slug
        </label>

        <input
          id="category-slug"
          value={slug}
          readOnly
          className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-600"
        />

        <p className="mt-1 text-xs text-gray-500">
          Generated automatically from the category name.
        </p>
      </div>

      <div>
        <label
          htmlFor="category-image"
          className="block text-sm font-medium text-gray-700"
        >
          Image
        </label>

        {imageUrl && !image && (
          <div className="mt-3">
            <img
              src={imageUrl}
              alt={name || "Category image"}
              className="h-32 w-32 rounded-lg border border-gray-200 object-cover"
            />

            <p className="mt-1 text-xs text-gray-500">
              Current image
            </p>
          </div>
        )}

        <input
          id="category-image"
          type="file"
          accept="image/*"
          disabled={isSubmitting}
          onChange={(event) => {
            setImage(event.target.files?.[0] ?? null);
          }}
          className="mt-2 block w-full text-sm"
        />

        {image && (
          <p className="mt-2 text-sm text-gray-500">
            Selected: {image.name}
          </p>
        )}
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isActive}
          disabled={isSubmitting}
          onChange={(event) =>
            setIsActive(event.target.checked)
          }
        />

        <span className="text-sm text-gray-700">
          Active
        </span>
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-300 px-5 py-2.5 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !name.trim() ||
            !slug
          }
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {isUploading
            ? "Uploading image..."
            : createCategory.isPending ||
                updateCategory.isPending
              ? "Saving..."
              : mode === "edit"
                ? "Save changes"
                : "Create category"}
        </button>
      </div>
    </form>
  );
}
