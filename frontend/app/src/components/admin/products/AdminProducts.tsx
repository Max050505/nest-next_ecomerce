"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import type { Product } from "@/types/product.types";

import {
  AdminTable,
  type AdminTableColumn,
} from "@/components/admin/ui/AdminTable";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { ProductFilters } from "./ProductFilters";
import { ProductRow, ProductActions } from "./ProductRow";

const PAGE_SIZE = 10;

export function AdminProducts() {
  const [page, setPage] = useState(1);

  // Текст у полі пошуку та застосований пошуковий запит.
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState("");

  const {
    data: productsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useProducts({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    category: category || undefined,
    isActive: isActive === "" ? undefined : isActive === "true",
  });

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories({
    page: 1,
    limit: 100,
  });

  const products = productsData?.data ?? [];
  const meta = productsData?.meta;

  const total = meta?.total ?? 0;
  const totalPages =
    meta?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Після видалення останнього товару на сторінці
  // повертаємося на останню доступну сторінку.
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function handleSearch() {
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setIsActive(value);
    setPage(1);
  }

  const columns: AdminTableColumn<Product>[] = [
    {
      key: "product",
      header: "Product",
      render: (product) => <ProductRow product={product} />,
      className: "min-w-[240px]",
    },
    {
      key: "sku",
      header: "SKU",
      render: (product) => (
        <span className="text-gray-600">{product.sku || "—"}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (product) => (
        <span className="whitespace-nowrap font-medium">
          {Number(product.price).toFixed(2)}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (product) => (
        <span
          className={
            product.stock === 0 ? "font-medium text-red-600" : "text-gray-700"
          }
        >
          {product.stock}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (product) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            product.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {product.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (product) => <ProductActions product={product} />,
      className: "whitespace-nowrap",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <p className="text-sm text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 p-6"
      >
        <p className="text-sm text-red-700">
          Failed to load products. Please try again.
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-3 text-sm font-medium text-red-700 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your store products.
          </p>
        </div>

        <a
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Add product
        </a>
      </div>

      <ProductFilters
        searchValue={searchInput}
        onSearchValueChange={setSearchInput}
        onSearch={handleSearch}
        category={category}
        onCategoryChange={handleCategoryChange}
        isActive={isActive}
        onStatusChange={handleStatusChange}
        categories={categoriesData?.data ?? []}
        isLoading={isFetching}
        isCategoriesLoading={isCategoriesLoading}
        isCategoriesError={isCategoriesError}
      />

      <div className="space-y-3">
        {isFetching && (
          <p role="status" className="text-xs text-gray-500">
            Updating products...
          </p>
        )}

        <AdminTable<Product>
          rows={products}
          columns={columns}
          getRowKey={(product) => product.id}
          emptyMessage="No products found. Try changing your filters."
        />

        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={PAGE_SIZE}
          isFetching={isFetching}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}
