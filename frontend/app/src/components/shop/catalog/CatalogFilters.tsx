"use client";

import { RefObject, useEffect, useState } from "react";
import { ChevronDown, SlidersHorizontal, X, Search } from "lucide-react";

import CustomInput from "@/components/ui/CustomInput";

interface CatalogCategory {
  id: string;
  name: string;
}

export interface CatalogFilterValues {
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
}

interface CatalogFiltersProps {
  search: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  categories: CatalogCategory[];
  productsRef: RefObject<HTMLDivElement | null>;
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: CatalogFilterValues) => void;
}

export function CatalogFilters({
  search,
  categoryId,
  minPrice,
  maxPrice,
  inStock,
  categories,
  onSearchChange,
  onApplyFilters,
  productsRef,
}: CatalogFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Локальні значення до натискання кнопки застосування.
  const [draftCategoryId, setDraftCategoryId] = useState(categoryId);
  const [draftMinPrice, setDraftMinPrice] = useState(minPrice);
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice);
  const [draftInStock, setDraftInStock] = useState(inStock);

  useEffect(() => {
    setDraftCategoryId(categoryId);
    setDraftMinPrice(minPrice);
    setDraftMaxPrice(maxPrice);
    setDraftInStock(inStock);
  }, [categoryId, minPrice, maxPrice, inStock]);

  const hasActiveFilters =
    Boolean(categoryId) || minPrice !== "" || maxPrice !== "" || inStock;

  const activeFiltersCount = [
    Boolean(categoryId),
    minPrice !== "",
    maxPrice !== "",
    inStock,
  ].filter(Boolean).length;

  const handleApply = () => {
    onApplyFilters({
      categoryId: draftCategoryId,
      minPrice: draftMinPrice,
      maxPrice: draftMaxPrice,
      inStock: draftInStock,
    });
    productsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setIsOpen(false);
  };
  const handleReset = () => {
    const resetFilters: CatalogFilterValues = {
      categoryId: "",
      minPrice: "",
      maxPrice: "",
      inStock: false,
    };

    setDraftCategoryId("");
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setDraftInStock(false);

    onApplyFilters(resetFilters);
    setIsOpen(false);

    productsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full max-w-xs">
          <CustomInput
            name="catalog-search"
            aria-label="Пошук товарів"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Знайти товар..."
            prefix={<Search size={18} className="text-gray-400" />}
            allowClear
            size="large"
          />
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="catalog-filter-panel"
          onClick={() => setIsOpen((open) => !open)}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
            hasActiveFilters
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal size={16} />
          Фільтри
          {hasActiveFilters && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-semibold text-gray-900">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div
        id="catalog-filter-panel"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-[400ms] ease-in-out ${
          isOpen
            ? "mt-4 grid-rows-[1fr] opacity-100"
            : "pointer-events-none mt-0 grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-gray-900">Фільтри товарів</h2>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Закрити фільтри"
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label
                    htmlFor="catalog-category"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Категорія
                  </label>

                  <select
                    id="catalog-category"
                    value={draftCategoryId}
                    onChange={(event) => setDraftCategoryId(event.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                  >
                    <option value="">Усі категорії</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full max-w-xs">
                  <label
                    htmlFor="catalog-min-price"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Ціна від
                  </label>

                  <CustomInput
                    name="catalog-min-price"
                    id="catalog-min-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={draftMinPrice}
                    onChange={(event) => setDraftMinPrice(event.target.value)}
                    placeholder="Від"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>
                <div className="w-full max-w-xs">
                  <label
                    htmlFor="catalog-max-price"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Ціна до
                  </label>

                  <CustomInput
                    name="catalog-max-price"
                    id="catalog-max-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={draftMaxPrice}
                    onChange={(event) => setDraftMaxPrice(event.target.value)}
                    placeholder="До"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>
              </div>
              <div className="flex items-end pb-2 pt-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <CustomInput
                    name="catalog-in-stock"
                    type="checkbox"
                    checked={draftInStock}
                    onChange={(event) => setDraftInStock(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                  />
                  Є в наявності
                </label>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-between gap-5 pb-2 px-2">
              <button
                type="button"
                onClick={handleApply}
                className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 "
              >
                Показати товари
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-sm text-gray-600 underline underline-offset-4 hover:text-gray-900"
                >
                  Скинути фільтри
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
