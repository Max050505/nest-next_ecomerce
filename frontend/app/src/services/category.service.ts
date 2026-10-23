import { api } from "@/lib/api";
import { CategoriesResponse, Category } from "@/types/category.types";

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  imagePublicId?: string;
  isActive?: boolean;
}
export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  imagePublicId?: string;
  isActive?: boolean;
}
export async function getCategories(
  params?: GetCategoriesParams,
): Promise<CategoriesResponse> {
  const response = await api.get<CategoriesResponse>("/categories", {
    params,
  });

  return response.data;
}
export async function getCategory(id: string) {
  const response = await api.get<Category>(`/categories/${id}`);

  return response.data;
}


export async function createCategory(payload: CreateCategoryPayload) {
  const response = await api.post("/categories", payload);

  return response.data;
}

export async function updateCategory(
  id: string,
  payload: UpdateCategoryPayload,
) {
  const response = await api.patch<Category>(`/categories/${id}`, payload);

  return response.data;
}

export async function deleteCategory(id: string) {
  const response = await api.delete(`/categories/${id}`);

  return response.data;
}
