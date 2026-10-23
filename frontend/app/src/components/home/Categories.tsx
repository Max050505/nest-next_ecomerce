"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { useCategories } from "@/hooks/use-categories";

export function Categories() {
  const { data, isLoading, isError } = useCategories({
    page: 1,
    limit: 4,
    isActive: true,
  });

  const categories = data?.data ?? [];

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#52745f]">
              Знайди своє
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Популярні категорії
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Переглядай асортимент і знаходь товари для себе.
            </p>
          </div>

          <Link
            href="/categories"
            className="hidden items-center gap-2 text-sm font-medium text-[#315c49] transition hover:gap-3 sm:inline-flex"
          >
            Усі категорії <span aria-hidden="true">→</span>
          </Link>
        </div>

        {isLoading && (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-gray-100" />
                <div className="mt-4 h-5 w-2/3 rounded bg-gray-100" />
                <div className="mt-2 h-4 w-full rounded bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Не вдалося завантажити категорії. Спробуй оновити сторінку.
          </div>
        )}

        {!isLoading && !isError && categories.length === 0 && (
          <div className="mt-10 rounded-2xl bg-[#f7f7f4] px-6 py-12 text-center">
            <p className="font-medium text-gray-800">Категорії поки відсутні</p>
            <p className="mt-2 text-sm text-gray-500">
              Завітай пізніше — асортимент поповнюватиметься.
            </p>
          </div>
        )}

        {!isLoading && !isError && categories.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={
                  category.slug ? `/categories/${category.slug}` : "/categories"
                }
                className="group min-w-0"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f1f0eb]">
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      Зображення відсутнє
                    </div>
                  )}

                  <span className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-white text-lg text-gray-900 shadow-sm transition group-hover:bg-[#315c49] group-hover:text-white">
                    <span aria-hidden="true">↗</span>
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-[#315c49]">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/categories"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-50 sm:hidden"
        >
          Усі категорії <span aria-hidden="true">→</span>
        </Link>
      </Container>
    </section>
  );
}
