
import type { Product } from '@/types/product.types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = [...product.images].sort(
    (a, b) => a.position - b.position,
  )[0];

  const formattedPrice = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 2,
  }).format(product.price);

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <div className="flex aspect-square items-center justify-center bg-gray-50">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.alt || product.name}
            loading="lazy"
            className="h-full w-full object-contain p-4"
          />
        ) : (
          <span className="text-sm text-gray-400">
            Немає зображення
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="mb-2 text-sm text-gray-500">
          {product.category || 'Без категорії'}
        </p>

        <h2 className="min-h-12 line-clamp-2 font-semibold text-gray-900">
          {product.name}
        </h2>

        <p className="mt-3 text-xl font-bold text-gray-900">
          {formattedPrice}
        </p>

        <p
          className={`mt-2 text-sm ${
            product.stock > 0 ? 'text-green-700' : 'text-red-600'
          }`}
        >
          {product.stock > 0 ? 'Є в наявності' : 'Немає в наявності'}
        </p>
      </div>
    </article>
  );
}
