import { ProductForm } from '@/components/admin/products/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Create product
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new product to your store.
        </p>
      </div>

      <ProductForm mode="create" />
    </div>
  );
}