"use client";

import Link from "next/link";
import { useUiStore } from "@/store/ui.store";

const navigation = [
  { href: "/", label: "Головна" },
  { href: "/shop", label: "Каталог" },
  { href: "/categories", label: "Категорії" },
  { href: "/cart", label: "Кошик" },
  { href: "/auth?mode=login", label: "Мій акаунт" },
];

export function MobileMenu() {
  const isOpen = useUiStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useUiStore((state) => state.closeMobileMenu);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        onClick={closeMobileMenu}
        aria-label="Закрити меню"
        className="absolute inset-0 size-full cursor-default bg-black/40 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Навігація магазину"
        className="absolute inset-y-0 left-0 flex w-[min(85%,360px)] flex-col bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="text-xl font-bold tracking-tight text-[#315c49]"
          >
            SHOP
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Закрити меню"
            className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-2xl transition hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <nav className="mt-6 flex flex-col">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
              className="border-b border-gray-100 py-4 text-base font-medium text-gray-700 transition hover:pl-2 hover:text-[#315c49]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-[#f5f3ee] p-5">
          <p className="font-semibold text-gray-900">Вітаємо у SHOP</p>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Знаходь товари, які роблять кожен день кращим.
          </p>
        </div>
      </aside>
    </div>
  );
}
