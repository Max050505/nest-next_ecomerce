"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeleteProduct } from "@/hooks/use-products";
import type { Product } from "@/types/product.types";
import { DeleteButton } from "@/components/ui/DeleteButton";

interface ProductRowProps {
  product: Product;
}

interface ProductActionsProps {
  product: Product;
}

export function ProductRow({ product }: ProductRowProps) {
  const image = product.images?.[0];

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0">
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="block truncate font-medium text-gray-900 hover:text-blue-600"
        >
          {product.name}
        </Link>

        <p className="mt-1 truncate text-xs text-gray-500">
          {product.description?.trim() || "No description"}
        </p>
      </div>
    </div>
  );
}

export function ProductActions({ product }: ProductActionsProps) {
  const deleteMutation = useDeleteProduct();

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/admin/products/${product.id}/edit`}
        className="text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        Edit
      </Link>

      <DeleteButton
        title="Delete product"
        description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmText="Delete product"
        cancelText="Cancel"
        loadingText="Deleting product..."
        onConfirm={() => deleteMutation.mutateAsync(product.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
