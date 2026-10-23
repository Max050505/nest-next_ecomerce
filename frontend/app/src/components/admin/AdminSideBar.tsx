"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
  },
  {
    name: "Categories",
    href: "/admin/categories",
  },
  {
    name: "Products",
    href: "/admin/products",
  },
  {
    name: "Users",
    href: "/admin/users",
  },
  {
    name: "Orders",
    href: "/admin/orders",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href="/admin" className="text-xl font-bold">
            Admin
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-200 text-white"
                    : "text-gray-600 hover:bg-gray-300 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <Link
            href="/"
            className="block rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-100"
          >
            ← Back to shop
          </Link>
        </div>
      </div>
    </aside>
  );
}
