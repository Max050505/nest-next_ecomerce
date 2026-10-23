
"use client";

import { DeleteButton } from "@/components/ui/DeleteButton";
import { EditButton } from "@/components/ui/EditButton";
import type { Category } from "@/types/category.types";

interface CategoriesTableProps {
  categories: Category[];
  deletingCategoryId?: string;
  isDeleting: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function CategoriesTable({
  categories,
  deletingCategoryId,
  isDeleting,
  onDelete,
}: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
        <p className="text-sm text-gray-500">
          No categories found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            {["Category", "Slug", "Products", "Status", "Actions"].map(
              (heading) => (
                <th
                  key={heading}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {categories.map((category) => {
            const isThisDeleting =
              isDeleting && deletingCategoryId === category.id;

            return (
              <tr
                key={category.id}
                className="transition hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt=""
                        className="h-11 w-11 rounded-lg border border-gray-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                        No image
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">
                        {category.name}
                      </p>
                      {category.description && (
                        <p className="mt-1 max-w-xs truncate text-sm text-gray-500">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-500">
                  {category.slug || "—"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-500">
                  {category.productCount}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={
                      category.isActive
                        ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                        : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                    }
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <EditButton
                      href={`/admin/categories/${category.id}/edit`}
                    />

                    <DeleteButton
                      title="Delete category?"
                      description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
                      onConfirm={() => onDelete(category.id)}
                      isLoading={isThisDeleting}
                      disabled={isDeleting}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
