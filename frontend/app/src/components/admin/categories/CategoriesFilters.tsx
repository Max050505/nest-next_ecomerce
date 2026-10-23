
"use client";

import { AdminSearch } from "../ui/AdminSearch";
import { AdminSelectFilter } from "../ui/AdminSelectFilters";

export type CategoryStatus = "all" | "active" | "inactive";

interface CategoriesFiltersProps {
  searchInput: string;
  status: CategoryStatus;
  isFetching: boolean;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  onStatusChange: (value: CategoryStatus) => void;
  onReset: () => void;
}

export function CategoriesFilters({
  searchInput,
  status,
  isFetching,
  onSearchInputChange,
  onSearch,
  onStatusChange,
  onReset,
}: CategoriesFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AdminSearch
        value={searchInput}
        onChange={onSearchInputChange}
        onSearch={onSearch}
        placeholder="Search categories..."
        isLoading={isFetching}
      />

      <AdminSelectFilter
        value={status}
        onChange={(value) =>
          onStatusChange(value as CategoryStatus)
        }
        ariaLabel="Filter categories by status"
        placeholder="All statuses"
        disabled={isFetching}
        options={[
          { label: "All statuses", value: "all" },
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ]}
      />

      <button
        type="button"
        onClick={onReset}
        disabled={isFetching}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
      >
        Reset
      </button>
    </div>
  );
}
