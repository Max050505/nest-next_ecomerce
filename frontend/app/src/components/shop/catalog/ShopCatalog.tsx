"use client";

import { useEffect, useRef, useState } from "react";
import { CatalogFilterValues } from "./CatalogFilters";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";

import { CatalogFilters } from "./CatalogFilters";
import { ProductGrid } from "./ProductGrid";
import { ShopPagination } from "../ui/ShopPagination";

const PAGE_SIZE = 12;

export function ShopCatalog() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);

  const productsRef = useRef<HTMLDivElement>(null);
  // Затримуємо пошук, щоб не надсилати запит на кожен символ.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const productsQuery = useProducts({
    page,
    limit: PAGE_SIZE,
    isActive: true,
    ...(search ? { search } : {}),
    ...(categoryId ? { category: categoryId } : {}),
    ...(minPrice !== "" ? { minPrice: Number(minPrice) } : {}),
    ...(maxPrice !== "" ? { maxPrice: Number(maxPrice) } : {}),
    ...(inStock ? { inStock: true } : {}),
  });

  const categoriesQuery = useCategories({
    page: 1,
    limit: 100,
    isActive: true,
  });
const handleApplyFilters = (filters: CatalogFilterValues) => {
  setCategoryId(filters.categoryId);
  setMinPrice(filters.minPrice);
  setMaxPrice(filters.maxPrice);
  setInStock(filters.inStock);
  setPage(1);

  productsRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};  
  const products = productsQuery.data?.data ?? [];
  const meta = productsQuery.data?.meta;
  const categories = categoriesQuery.data?.data ?? [];

  return (
    <section>
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500">
          Наш асортимент
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Каталог товарів
        </h1>

        <p className="mt-3 text-gray-600">
          Переглядай асортимент і знаходь потрібні товари.
        </p>
      </header>

      <CatalogFilters
        search={searchInput}
        categoryId={categoryId}
        minPrice={minPrice}
        maxPrice={maxPrice}
        inStock={inStock}
        categories={categories}
        productsRef={productsRef}
        onSearchChange={setSearchInput}
        onApplyFilters={handleApplyFilters}
      />

      {categoriesQuery.isError && (
        <p role="status" className="mb-4 text-sm text-amber-700">
          Не вдалося завантажити категорії. Спробуй оновити сторінку.
        </p>
      )}

      <div ref={productsRef} className="scroll-mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Усього товарів: {meta?.total ?? 0}
          </p>

          {productsQuery.isFetching && !productsQuery.isLoading && (
            <span className="text-sm text-gray-500">Оновлення...</span>
          )}
        </div>

        <div
          className={`transition-opacity duration-300 ease-in-out ${
            productsQuery.isFetching && !productsQuery.isLoading
              ? "opacity-60"
              : "opacity-100"
          }`}
          aria-busy={productsQuery.isFetching}
        >
          <ProductGrid
            products={products}
            isLoading={productsQuery.isLoading}
            isError={productsQuery.isError}
            onRetry={() => void productsQuery.refetch()}
          />
        </div>
      </div>

      {!productsQuery.isLoading && !productsQuery.isError && meta && (
        <ShopPagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={PAGE_SIZE}
          isFetching={productsQuery.isFetching}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}
