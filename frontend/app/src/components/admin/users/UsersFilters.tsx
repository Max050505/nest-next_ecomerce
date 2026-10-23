"use client";

import type { FormEvent } from "react";
import type { UserRole } from "@/types/users.types";
import { AdminSearch } from "../ui/AdminSearch";
import { AdminSelectFilter } from "../ui/AdminSelectFilters";

interface UsersFiltersProps {
  searchInput: string;
  role: UserRole | "";
  isFetching: boolean;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  onRoleChange: (value: UserRole | "") => void;
  onReset: () => void;
}

export function UsersFilters({
  searchInput,
  role,
  isFetching,
  onSearchInputChange,
  onSearch,
  onRoleChange,
  onReset,
}: UsersFiltersProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <AdminSearch
        value={searchInput}
        onChange={onSearchInputChange}
        onSearch={onSearch}
        placeholder="Search users by name or email..."
        isLoading={isFetching}
      />

      <AdminSelectFilter
        value={role}
        onChange={(value) => onRoleChange(value as UserRole | "")}
        ariaLabel="Filter users by role"
        placeholder="All roles"
        disabled={isFetching}
        options={[
          { label: "User", value: "USER" },
          { label: "Admin", value: "ADMIN" },
        ]}
      />

      <button
        type="button"
        onClick={onReset}
        disabled={isFetching}
        className="rounded-md border px-4 py-2 disabled:opacity-50"
      >
        Reset
      </button>
    </div>
  );
}
