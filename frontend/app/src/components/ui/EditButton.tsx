import Link from "next/link";

interface EditButtonProps {
  href: string;
  label?: string;
}

export function EditButton({
  href,
  label = "Edit",
}: EditButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
    >
      {label}
    </Link>
  );
}

