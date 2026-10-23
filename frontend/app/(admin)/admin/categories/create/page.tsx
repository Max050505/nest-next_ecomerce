import { CategoryForm } from '@/components/admin/categories/CategoryForm';

export default function CreateCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Create category
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new product category.
        </p>
      </div>

      <CategoryForm mode="create" />
    </div>
  );
}