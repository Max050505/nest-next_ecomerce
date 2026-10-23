"use client";

import type { OrderStatus } from "@/types/order.types";
import { AdminSearch } from "@/components/admin/ui/AdminSearch";
import {
  AdminSelectFilter,
  type AdminSelectOption,
} from "@/components/admin/ui/AdminSelectFilters";

interface OrderFiltersProps {
  searchInput: string;
  status: OrderStatus | "";
  isLoading?: boolean;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  onStatusChange: (value: string) => void;
}

const statusOptions: AdminSelectOption[] = [
  { label: "Усі статуси", value: "" },
  { label: "Очікує обробки", value: "PENDING" },
  { label: "Обробляється", value: "PROCESSING" },
  { label: "Відправлено", value: "SHIPPED" },
  { label: "Доставлено", value: "DELIVERED" },
  { label: "Скасовано", value: "CANCELLED" },
];

export function OrderFilters({
  searchInput,
  status,
  isLoading = false,
  onSearchInputChange,
  onSearch,
  onStatusChange,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <AdminSearch
          value={searchInput}
          onChange={onSearchInputChange}
          onSearch={onSearch}
          placeholder="Пошук за номером замовлення..."
          isLoading={isLoading}
        />
      </div>

      <div className="w-full sm:w-56">
        <AdminSelectFilter
          value={status}
          options={statusOptions}
          onChange={onStatusChange}
          ariaLabel="Фільтр за статусом замовлення"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}