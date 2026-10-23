
"use client";

export interface AdminSelectOption {
  label: string;
  value: string;
}

interface AdminSelectFilterProps {
  value: string;
  options: AdminSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  disabled?: boolean;
}

export function AdminSelectFilter({
  value,
  options,
  onChange,
  placeholder = "All",
  ariaLabel,
  disabled = false,
}: AdminSelectFilterProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
      disabled={disabled}
      className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
