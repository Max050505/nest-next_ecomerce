"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUsers, useDeleteUser } from "@/hooks/use-users";
import type { UserRole } from "@/types/users.types";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { AdminPagination } from "../ui/AdminPagination";
import { UsersFilters } from "./UsersFilters";
import { UsersTable } from "./UsersTable";
export function AdminUsers() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const limit = 10;
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { data, isLoading, isError, isFetching, isPlaceholderData, refetch } =
    useUsers({
      page,
      limit,
      search: search || undefined,
      role: role || undefined,
    });
  const deleteUser = useDeleteUser();

  useEffect(() => {
    if (!data || isPlaceholderData) return;

    if (page > Math.max(1, data.meta.totalPages)) {
      setPage(Math.max(1, data.meta.totalPages));
    }
  }, [data, isPlaceholderData, page]);

  const { data: currentUser } = useCurrentUser();
  function handleSearch(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  function handleRoleChange(value: UserRole | "") {
    setRole(value);
    setPage(1);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <p className="text-sm text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600">Failed to load users.</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Try again
        </button>
      </div>
    );
  }

  const users = data?.data ?? [];
  const meta = data?.meta;

  async function handleDeleteUser(id: string) {
    setNotice(null);

    try {
      const result = await deleteUser.mutateAsync(id);

      setNotice({
        type: "success",
        text: result.message || "User deleted successfully.",
      });
    } catch (error: unknown) {
      let message = "Failed to delete user. Please try again.";

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

      setNotice({
        type: "error",
        text: message,
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage registered users and their roles.
        </p>
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
      {/* Search and filters */}
      <UsersFilters
        searchInput={searchInput}
        role={role}
        isFetching={isFetching}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRoleChange={handleRoleChange}
        onReset={() => {
          setSearchInput("");
          setSearch("");
          setRole("");
          setPage(1);
        }}
      />

      {isFetching && isPlaceholderData && (
        <p className="text-sm text-gray-500" role="status">
          Updating users...
        </p>
      )}
      {/* Table */}
      <div className={isPlaceholderData ? "opacity-60" : ""}>
        <UsersTable
          users={users}
          currentUserId={currentUser?.id}
          deletingUserId={deleteUser.variables}
          isDeleting={deleteUser.isPending}
          onDelete={handleDeleteUser}
        />
      </div>

      {/* Pagination */}
      {data?.meta && (
        <AdminPagination
          page={page}
          totalPages={data.meta.totalPages}
          total={data.meta.total}
          limit={limit}
          isFetching={isFetching || isPlaceholderData}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
