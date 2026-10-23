"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { AdminPagination } from "../ui/AdminPagination";
import { CategoriesFilters } from "./CategoriesFilters";
import { CategoriesTable } from "./CategoriesTable";

type CategoryStatus = "all" | "active" | "inactive";

export function AdminCategories() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CategoryStatus>("all");

  const limit = 10;

  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isActive = status === "all" ? undefined : status === "active";

  const { data, isLoading, isError, isFetching, isPlaceholderData, refetch } =
    useCategories({
      page,
      limit,
      search: search || undefined,
      isActive,
    });

  const deleteCategory = useDeleteCategory();

  useEffect(() => {
    if (!data || isPlaceholderData) return;

    const lastPage = Math.max(1, data.meta.totalPages);

    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [data, isPlaceholderData, page]);

  async function handleDeleteCategory(id: string): Promise<void> {
    setNotice(null);

    try {
      const result = await deleteCategory.mutateAsync(id);

      setNotice({
        type: "success",
        text: result.message || "Category deleted successfully.",
      });
    } catch (error: unknown) {
      let message = "Failed to delete category.";

      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;

        if (Array.isArray(apiMessage)) {
          message = apiMessage.join(", ");
        } else if (typeof apiMessage === "string") {
          message = apiMessage;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      setNotice({ type: "error", text: message });

      // DeleteButton має отримати помилку,
      // щоб не закривати модальне вікно.
      throw error;
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <p className="text-sm text-gray-500">Loading categories...</p>
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600">Failed to load categories.</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-3 rounded-lg border border-red-300 px-4 py-2 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  const categories = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage product categories.
          </p>
        </div>

        <ButtonLink href="/admin/categories/create">
          + Create category
        </ButtonLink>
      </div>

      {notice && (
        <div
          role="status"
          aria-live="polite"
          className={
            notice.type === "success"
              ? "rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
              : "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          }
        >
          {notice.text}
        </div>
      )}

      {isError && data && (
        <p role="alert" className="text-sm text-red-600">
          Failed to refresh categories. Showing the last available data.
        </p>
      )}

      <CategoriesFilters
        searchInput={searchInput}
        status={status}
        isFetching={isFetching}
        onSearchInputChange={setSearchInput}
        onSearch={() => {
          setSearch(searchInput.trim());
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onReset={() => {
          setSearchInput("");
          setSearch("");
          setStatus("all");
          setPage(1);
        }}
      />

      {isFetching && (
        <p role="status" className="text-sm text-gray-500">
          Updating categories...
        </p>
      )}

      <div className={isPlaceholderData ? "opacity-60" : ""}>
        <CategoriesTable
          categories={categories}
          deletingCategoryId={
            deleteCategory.isPending ? deleteCategory.variables : undefined
          }
          isDeleting={deleteCategory.isPending}
          onDelete={handleDeleteCategory}
        />
      </div>

      {meta && (
        <AdminPagination
          page={page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={limit}
          isFetching={isFetching || isPlaceholderData}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
