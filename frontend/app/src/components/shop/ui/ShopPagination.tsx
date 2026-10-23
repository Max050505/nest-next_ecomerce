import { PaginationButton } from "@/components/ui/PaginationButton";

interface ShopPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
}

export function ShopPagination({
  page,
  totalPages,
  total,
  limit,
  isFetching = false,
  onPageChange,
}: ShopPaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-gray-600">
        Показано {start}–{end} із {total} товарів
      </p>

      <div className="flex items-center gap-2">
        <PaginationButton
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isFetching}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Назад
        </PaginationButton>

        <span className="text-sm text-gray-600">
          Сторінка {page} з {safeTotalPages}
        </span>

        <PaginationButton
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isFetching}
        >
          Наступна
        </PaginationButton>
      </div>
    </div>
  );
}
