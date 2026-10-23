
"use client";

import { AdminSearch } from "@/components/admin/ui/AdminSearch";
import { AdminSelectFilter } from "@/components/admin/ui/AdminSelectFilters";

interface ProductFiltersProps {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSearch: () => void;

  category: string;
  onCategoryChange: (value: string) => void;

  isActive: string;
  onStatusChange: (value: string) => void;

  categories: Array<{
    id: string;
    name: string;
  }>;

  isLoading?: boolean;
  isCategoriesLoading?: boolean;
  isCategoriesError?: boolean;
}

export function ProductFilters({
  searchValue,
  onSearchValueChange,
  onSearch,
  category,
  onCategoryChange,
  isActive,
  onStatusChange,
  categories,
  isLoading = false,
  isCategoriesLoading = false,
  isCategoriesError = false,
}: ProductFiltersProps) {
  const categoryOptions = categories.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex-1">
          <AdminSearch
            value={searchValue}
            onChange={onSearchValueChange}
            onSearch={onSearch}
            placeholder="Search products by name or SKU..."
            isLoading={isLoading}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-col gap-1">
            <AdminSelectFilter
              value={category}
              onChange={onCategoryChange}
              options={categoryOptions}
              ariaLabel="Filter products by category"
              placeholder={
                isCategoriesLoading
                  ? "Loading categories..."
                  : "All categories"
              }
              disabled={isCategoriesLoading || isCategoriesError}
            />

            {isCategoriesError && (
              <p className="text-xs text-red-600">
                Failed to load categories.
              </p>
            )}
          </div>

          <AdminSelectFilter
            value={isActive}
            onChange={onStatusChange}
            ariaLabel="Filter products by status"
            placeholder="All statuses"
            options={[
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
