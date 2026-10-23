export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  alt?: string | null;
  position: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string;
  images: ProductImage[];
  category: string | null;
  categoryId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: ProductsMeta;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface CreateProductImagePayload {
  url: string;
  publicId: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  images?: CreateProductImagePayload[];
  categoryId: string;
  isActive?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  sku?: string;
  images?: CreateProductImagePayload[];
  categoryId?: string;
  isActive?: boolean;
}