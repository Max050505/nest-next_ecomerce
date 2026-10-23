import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  GetCategoriesParams,
  createCategory,
  updateCategory,
  deleteCategory,
  type UpdateCategoryPayload,
  getCategory,
} from "@/services/category.service";
import { useCategoryStore } from "@/store/admin/category.store";

export function useCategories(params?: GetCategoriesParams) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
    staleTime: 1000 * 60,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategory(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}

export function useAdminCategories() {
  const page = useCategoryStore((state) => state.page);
  const limit = useCategoryStore((state) => state.limit);
  const search = useCategoryStore((state) => state.search);
  const isActive = useCategoryStore((state) => state.isActive);

  return useQuery({
    queryKey: [
      "categories",
      {
        page,
        limit,
        search,
        isActive,
      },
    ],

    queryFn: () =>
      getCategories({
        page,
        limit,
        search: search || undefined,
        isActive,
      }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => updateCategory(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["category", variables.id],
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}
