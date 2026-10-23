"use client";

import Link from "next/link";
import { useUiStore } from "@/store/ui.store";
import { MobileMenu } from "./MobileMenu";
import { Container } from "@/components/ui/Container";

export function Header() {
  const toggleMobileMenu = useUiStore((state) => state.toggleMobileMenu);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
        <Container className="flex h-[72px] items-center">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="mr-4 flex size-10 items-center justify-center rounded-full text-xl transition hover:bg-gray-100 md:hidden"
            aria-label="Відкрити меню"
          >
            ☰
          </button>

          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-[#315c49]"
            aria-label="SHOP — головна сторінка"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-[#315c49] text-sm text-white">
              S
            </span>
            <span>SHOP</span>
          </Link>

          <nav className="ml-10 hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm text-gray-600 transition hover:text-[#315c49]"
            >
              Головна
            </Link>

            <Link
              href="/shop"
              className="text-sm text-gray-600 transition hover:text-[#315c49]"
            >
              Каталог
            </Link>

            <Link
              href="/categories"
              className="text-sm text-gray-600 transition hover:text-[#315c49]"
            >
              Категорії
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <Link
              href="/shop"
              aria-label="Перейти до пошуку товарів"
              className="flex size-10 items-center justify-center rounded-full text-lg transition hover:bg-gray-100"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="size-5"
                aria-hidden="true"
              >
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4 4" />
              </svg>
            </Link>

            <Link
              href="/auth?mode=login"
              aria-label="Мій акаунт"
              className="hidden size-10 items-center justify-center rounded-full transition hover:bg-gray-100 sm:flex"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="size-5"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
              </svg>
            </Link>

            <Link
              href="/cart"
              aria-label="Кошик"
              className="relative flex size-10 items-center justify-center rounded-full transition hover:bg-gray-100"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="size-5"
                aria-hidden="true"
              >
                <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="17" cy="20" r="1" />
              </svg>
            </Link>
          </div>
        </Container>
      </header>

      <MobileMenu />
    </>
  );
}
