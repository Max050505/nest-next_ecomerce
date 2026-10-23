import { PaginationButton } from "@/components/ui/PaginationButton";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
}

export function AdminPagination({
  page,
  totalPages,
  total,
  limit,
  isFetching = false,
  onPageChange,
}: AdminPaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-gray-600">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex items-center gap-2">
        <PaginationButton
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isFetching}
        >
          Previous
        </PaginationButton>

        <span className="text-sm">
          Page {page} of {safeTotalPages}
        </span>

        <PaginationButton
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= safeTotalPages || isFetching}
        >
          Next
        </PaginationButton>
      </div>
    </div>
  );
}
