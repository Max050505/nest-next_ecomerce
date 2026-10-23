"use client";

import type { AdminTableColumn } from "@/components/admin/ui/AdminTable";
import { AdminTable } from "@/components/admin/ui/AdminTable";
import { DeleteButton } from "@/components/ui/DeleteButton";
import type { User } from "@/types/users.types";

interface UsersTableProps {
  users: User[];
  currentUserId?: string;
  deletingUserId?: string;
  isDeleting: boolean;
  onDelete: (id: string) => Promise<unknown>;
}

function formatUserName(user: User): string {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return name || "—";
}

const createUserColumns = ({
  currentUserId,
  deletingUserId,
  isDeleting,
  onDelete,
}: Pick<
  UsersTableProps,
  "currentUserId" | "deletingUserId" | "isDeleting" | "onDelete"
>): AdminTableColumn<User>[] => [
  {
    key: "name",
    header: "Name",
    render: (user) => formatUserName(user),
  },
  {
    key: "email",
    header: "Email",
    render: (user) => user.email,
  },
  {
    key: "role",
    header: "Role",
    render: (user) => user.role,
  },
  {
    key: "createdAt",
    header: "Created at",
    render: (user) => new Date(user.createdAt).toLocaleDateString("uk-UA"),
  },
  {
    key: "actions",
    header: "Actions",
    render: (user) => {
      if (user.id === currentUserId) {
        return "—";
      }

      return (
        <DeleteButton
          title="Delete user"
          description={`Are you sure you want to delete ${formatUserName(user)}? This action cannot be undone.`}
          onConfirm={() => onDelete(user.id)}
          isLoading={isDeleting && deletingUserId === user.id}
          disabled={isDeleting}
        />
      );
    },
  },
];

export function UsersTable(props: UsersTableProps) {
  const columns = createUserColumns(props);

  return (
    <AdminTable
      rows={props.users}
      columns={columns}
      getRowKey={(user) => user.id}
      emptyMessage="No users found."
    />
  );
}
