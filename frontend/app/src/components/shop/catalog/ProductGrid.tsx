import type { Product } from "@/types/product.types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function ProductGrid({
  products,
  isLoading,
  isError,
  onRetry,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <p className="py-12 text-center text-gray-500">Завантаження товарів...</p>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 p-6 text-center"
      >
        <p className="text-red-700">Не вдалося завантажити товари.</p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-3 font-medium text-red-700 underline"
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Товарів не знайдено
        </h2>

        <p className="mt-2 text-gray-500">
          Спробуй змінити пошук або вибрати іншу категорію.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
