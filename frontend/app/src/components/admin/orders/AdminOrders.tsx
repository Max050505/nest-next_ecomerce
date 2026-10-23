"use client";

import { useState } from "react";
import Link from "next/link";

import { AdminTable } from "@/components/admin/ui/AdminTable";
import type { AdminTableColumn } from "@/components/admin/ui/AdminTable";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { DeleteButton } from "@/components/ui/DeleteButton";

import { OrderFilters } from "./OrderFilters";
import { useCancelOrder, useOrders } from "@/hooks/use-orders";
import type { Order, OrderStatus } from "@/types/order.types";

const LIMIT = 10;

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Очікує обробки",
  PROCESSING: "Обробляється",
  SHIPPED: "Відправлено",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
};

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const currencyFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
});

function formatDate(date: string) {
  return new Date(date).toLocaleString("uk-UA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminOrders() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");

  const { data, isPending, isFetching, isError, error } = useOrders({
    page,
    limit: LIMIT,
    search: search || undefined,
    status: status || undefined,
  });

  const cancelMutation = useCancelOrder();

  const orders = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as OrderStatus | "");
    setPage(1);
  };

  const columns: AdminTableColumn<Order>[] = [
    {
      key: "id",
      header: "Замовлення",
      render: (order) => (
        <span className="font-mono text-sm" title={order.id}>
          #{order.id.length > 8 ? order.id.slice(0, 8) : order.id}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Клієнт",
      render: (order) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {order.userName || "Без імені"}
          </span>
          <span className="text-sm text-gray-500">
            {order.userEmail || order.userId}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Дата",
      render: (order) => (
        <span className="whitespace-nowrap text-sm">
          {formatDate(order.createdAt)}
        </span>
      ),
    },
    {
      key: "items",
      header: "Товари",
      render: (order) => {
        const quantity = order.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        return <span>{quantity}</span>;
      },
    },
    {
      key: "total",
      header: "Сума",
      render: (order) => (
        <span className="whitespace-nowrap font-medium">
          {currencyFormatter.format(order.total)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Статус",
      render: (order) => (
        <span
          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[order.status]}`}
        >
          {statusLabels[order.status]}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Дії",
      render: (order) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/orders/${order.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Деталі
          </Link>

          {order.status === "PENDING" && (
            <DeleteButton
              title="Скасувати замовлення?"
              description={`Замовлення #${order.id} буде скасовано. Цю дію можна виконати лише для замовлення, яке очікує обробки.`}
              confirmText="Скасувати замовлення"
              cancelText="Назад"
              loadingText="Скасування..."
              isLoading={
                cancelMutation.isPending &&
                cancelMutation.variables === order.id
              }
              disabled={cancelMutation.isPending}
              onConfirm={() => cancelMutation.mutateAsync(order.id)}
            />
          )}
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Не вдалося завантажити замовлення.
        {error instanceof Error && (
          <p className="mt-1 text-sm">{error.message}</p>
        )}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Замовлення</h1>
        <p className="mt-1 text-sm text-gray-500">
          Перегляд і керування замовленнями клієнтів.
        </p>
      </div>

      <OrderFilters
        searchInput={searchInput}
        status={status}
        isLoading={isFetching}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
      />

      <div className="space-y-4">
        <AdminTable
          rows={orders}
          columns={columns}
          getRowKey={(order) => order.id}
          emptyMessage={
            isPending
              ? "Завантаження замовлень..."
              : "Замовлень не знайдено."
          }
        />

        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={LIMIT}
          isFetching={isFetching}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}