
'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Container } from '@/components/ui/Container';
import { useCategories } from '@/hooks/use-categories';

export function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const {
    data,
    isLoading,
    isError,
  } = useCategories({
    page,
    limit: 12,
    search: search || undefined,
    isActive: true,
  });

  const categories = data?.data ?? [];
  const meta = data?.meta;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <main className="py-16">
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Categories
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Shop by category
            </h1>

            <p className="mt-3 max-w-2xl text-gray-500">
              Explore our product categories and find exactly what
              you are looking for.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-10">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              handleSearch(event.target.value)
            }
            placeholder="Search categories..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-500 sm:max-w-md"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            Failed to load categories.
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && categories.length === 0 && (
          <div className="mt-10 rounded-xl border border-gray-200 p-10 text-center">
            <h2 className="text-lg font-semibold">
              No categories found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search.
            </p>
          </div>
        )}

        {/* Categories */}
        {!isLoading && !isError && categories.length > 0 && (
          <>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={
                    category.slug
                      ? `/categories/${category.slug}`
                      : '/categories'
                  }
                  className="group rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-all hover:-translate-y-1 hover:bg-gray-100 hover:shadow-sm"
                >
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gray-200">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">
                        No image
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 text-lg font-semibold">
                    {category.name}
                  </h2>

                  {category.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {category.description}
                    </p>
                  )}

                  <span className="mt-4 inline-block text-sm font-medium">
                    Shop now →
                  </span>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-500">
                  Page {meta.page} of {meta.totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </main>
  );
}

