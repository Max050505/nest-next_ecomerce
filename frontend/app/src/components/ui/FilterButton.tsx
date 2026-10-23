interface FilterButtonProps {
  isOpen: boolean;
  onClick: () => void;
  activeCount?: number;
}

export function FilterButton({
  isOpen,
  onClick,
  activeCount = 0,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M4 7h16M7 12h10m-7 5h4" />
      </svg>
      Filters
      {activeCount > 0 && (
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs">
          {activeCount}
        </span>
      )}
    </button>
  );
}
