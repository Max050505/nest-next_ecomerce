import Link from "next/link";

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ButtonLink({
  href,
  children,
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`rounded-lg bg-gray-300 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-400 ${className}`}
    >
      {children}
    </Link>
  );
}
