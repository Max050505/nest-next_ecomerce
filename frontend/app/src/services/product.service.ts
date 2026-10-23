import { api } from '@/lib/api';

import {
  CreateProductPayload,
  GetProductsParams,
  Product,
  ProductsResponse,
  UpdateProductPayload,
} from '@/types/product.types';

export async function getProducts(
  params?: GetProductsParams,
): Promise<ProductsResponse> {
  const response = await api.get<ProductsResponse>('/products', {
    params,
  });

  return response.data;
}

export async function getProduct(
  id: string,
): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);

  return response.data;
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  const response = await api.post<Product>(
    '/products',
    payload,
  );

  return response.data;
}

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> {
  const response = await api.patch<Product>(
    `/products/${id}`,
    payload,
  );

  return response.data;
}

export async function deleteProduct(
  id: string,
): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(
    `/products/${id}`,
  );

  return response.data;
}