import { api } from "@/lib/api";

import type {
  GetOrdersParams,
  OrderApiResponse,
  PaginatedOrders,
  UpdateOrderPayload,
} from "@/types/order.types";

export async function getOrders(
  params?: GetOrdersParams,
): Promise<PaginatedOrders> {
  const response = await api.get<PaginatedOrders>(
    "/orders/admin/all",
    { params },
  );

  return response.data;
}

export async function getOrder(
  id: string,
): Promise<OrderApiResponse> {
  const response = await api.get<OrderApiResponse>(
    `/orders/admin/${id}`,
  );

  return response.data;
}

export async function updateOrder(
  id: string,
  payload: UpdateOrderPayload,
): Promise<OrderApiResponse> {
  const response = await api.patch<OrderApiResponse>(
    `/orders/admin/${id}`,
    payload,
  );

  return response.data;
}

export async function cancelOrder(
  id: string,
): Promise<OrderApiResponse> {
  const response = await api.delete<OrderApiResponse>(
    `/orders/admin/${id}`,
  );

  return response.data;
}