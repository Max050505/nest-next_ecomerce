"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductImage } from "@/types/product.types";
import {
  useCreateProduct,
  useProduct,
  useUpdateProduct,
} from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { uploadImage } from "@/services/cloudinary.service";

import type { CreateProductPayload } from "@/types/product.types";

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
}

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useProduct(mode === "edit" ? (productId ?? "") : "");
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories({
    page: 1,
    limit: 100,
    isActive: true,
  });

  const categories = categoriesData?.data ?? [];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [formError, setFormError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const isSubmitting =
    createProduct.isPending || updateProduct.isPending || isUploading;
  useEffect(() => {
    if (mode !== "edit" || !product) return;

    setName(product.name);
    setDescription(product.description ?? "");
    setPrice(String(product.price));
    setStock(String(product.stock));
    setSku(product.sku ?? "");
    setCategoryId(product.categoryId ?? "");
    setIsActive(product.isActive);
    setExistingImages(
      [...(product.images ?? [])].sort((a, b) => a.position - b.position),
    );
  }, [mode, product]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);
  if (mode === "edit" && isProductLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <p className="text-sm text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (mode === "edit" && (isProductError || !product)) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600">
          Failed to load product. Please try again.
        </p>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="mt-3 text-sm font-medium underline"
        >
          Back to products
        </button>
      </div>
    );
  }
  function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    // Дозволяємо додавати зображення поступово.
    const remainingSlots = MAX_IMAGES - files.length;
    const availableFiles = selectedFiles.slice(0, remainingSlots);

    const invalidFile = availableFiles.find(
      (file) => !file.type.startsWith("image/") || file.size > MAX_FILE_SIZE,
    );

    if (invalidFile) {
      setFormError("Each image must be an image file no larger than 5 MB.");
      event.target.value = "";
      return;
    }

    setFormError("");

    setFiles((currentFiles) =>
      [...currentFiles, ...availableFiles].slice(0, MAX_IMAGES),
    );

    // Дозволяємо повторно вибрати той самий файл.
    event.target.value = "";
  }
  function handleRemoveExistingImage(imageId: ProductImage["id"]) {
    setExistingImages((current) =>
      current.filter((image) => image.id !== imageId),
    );
  }
  function handleRemoveImage(index: number) {
    setFiles((currentFiles) => currentFiles.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!name.trim() || !sku.trim() || !categoryId) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setFormError("Price must be a valid non-negative number.");
      return;
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      setFormError("Stock must be a non-negative whole number.");
      return;
    }

    if (
      !Number.isFinite(parsedPrice * 100) ||
      Math.abs(parsedPrice * 100 - Math.round(parsedPrice * 100)) > 0.000001
    ) {
      setFormError("Price can have at most two decimal places.");
      return;
    }

    try {
      setIsUploading(true);

      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const uploadedImage = await uploadImage(file, "products");

          return {
            url: uploadedImage.url,
            publicId: uploadedImage.publicId,
          };
        }),
      );

      const images = [
        ...existingImages.map((image) => ({
          url: image.url,
          publicId: image.publicId,
          alt: image.alt ?? undefined,
        })),
        ...uploadedImages,
      ];

      const payload: CreateProductPayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: parsedPrice,
        stock: parsedStock,
        sku: sku.trim(),
        categoryId,
        isActive,
        images,
      };

      if (mode === "create") {
        await createProduct.mutateAsync(payload);
      } else {
        if (!productId) {
          throw new Error("Product ID is missing.");
        }

        await updateProduct.mutateAsync({
          id: productId,
          payload,
        });
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Failed to create product:", error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to create product. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Product information
        </h2>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Product name *
            </label>

            <input
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={200}
              required
              disabled={isSubmitting}
              placeholder="Enter product name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              disabled={isSubmitting}
              placeholder="Describe the product..."
              className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 disabled:bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Price *
              </label>

              <input
                id="price"
                name="price"
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                min="0"
                step="0.01"
                required
                disabled={isSubmitting}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Stock *
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                min="0"
                step="1"
                required
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="sku"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                SKU *
              </label>

              <input
                id="sku"
                name="sku"
                value={sku}
                onChange={(event) => setSku(event.target.value)}
                maxLength={50}
                required
                disabled={isSubmitting}
                placeholder="PROD-001"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label
                htmlFor="categoryId"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category *
              </label>

              <select
                id="categoryId"
                name="categoryId"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
                disabled={
                  isSubmitting || isCategoriesLoading || isCategoriesError
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500 disabled:bg-gray-50"
              >
                <option value="">
                  {isCategoriesLoading
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {isCategoriesError && (
                <p className="mt-2 text-sm text-red-600">
                  Failed to load categories. Please try again.
                </p>
              )}

              {!isCategoriesLoading &&
                !isCategoriesError &&
                categories.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600">
                    Create an active category before adding a product.
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Product images
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Upload up to {MAX_IMAGES} images. Maximum 5 MB per image.
          </p>
        </div>

        <div className="mt-5">
          <label
            htmlFor="images"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 text-center transition hover:border-gray-400 hover:bg-gray-50"
          >
            <svg
              className="h-10 w-10 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>

            <span className="mt-3 text-sm font-medium text-gray-700">
              Click to upload images
            </span>

            <span className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP</span>

            <input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              disabled={isSubmitting || files.length >= MAX_IMAGES}
              onChange={handleFilesChange}
              className="sr-only"
            />
          </label>
        </div>

        {previews.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {previews.map((preview, index) => (
              <div key={`${files[index].name}-${index}`} className="relative">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={preview}
                    alt={`Product preview ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="160px"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  disabled={isSubmitting}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-sm text-white shadow transition hover:bg-red-700 disabled:opacity-50"
                >
                  ×
                </button>

                <p className="mt-2 truncate text-xs text-gray-500">
                  {files[index].name}
                </p>
              </div>
            ))}
          </div>
        )}
        {existingImages.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Current images</h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {existingImages.map((image) => (
                <div key={image.id} className="relative">
                  <div className="relative aspect-square overflow-hidden rounded-lg border">
                    <Image
                      src={image.url}
                      alt={image.alt || name || "Product image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 160px"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(image.id)}
                    className="mt-2 w-full rounded-md border border-red-200 px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>

        <label className="mt-4 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-gray-300 accent-gray-900"
          />

          <span>
            <span className="block text-sm font-medium text-gray-700">
              Active product
            </span>

            <span className="mt-1 block text-xs text-gray-500">
              Active products can be displayed in the store.
            </span>
          </span>
        </label>
      </div>

      {formError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </div>
      )}

      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <Link
          href="/admin/products"
          aria-disabled={isSubmitting}
          className={`rounded-lg border border-gray-300 px-5 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50 ${
            isSubmitting ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            isCategoriesLoading ||
            isCategoriesError ||
            categories.length === 0
          }
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading
            ? "Uploading images..."
            : createProduct.isPending
              ? "Creating product..."
              : updateProduct.isPending
                ? "Updating product..."
                : mode === "create"
                  ? "Create product"
                  : "Update product"}
        </button>
      </div>
    </form>
  );
}
