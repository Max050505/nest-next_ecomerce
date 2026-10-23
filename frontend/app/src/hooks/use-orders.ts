import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  cancelOrder,
  getOrder,
  getOrders,
  updateOrder,
} from "@/services/order.service";

import type {
  GetOrdersParams,
  UpdateOrderPayload,
} from "@/types/order.types";

export const orderKeys = {
  all: ["orders"] as const,

  lists: () => [...orderKeys.all, "list"] as const,

  list: (params?: GetOrdersParams) =>
    [...orderKeys.lists(), params] as const,

  details: () => [...orderKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...orderKeys.details(), id] as const,
};

export function useOrders(params?: GetOrdersParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
    staleTime: 1000 * 60,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateOrderPayload;
    }) => updateOrder(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: orderKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.detail(variables.id),
        }),
      ]);
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelOrder(id),

    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: orderKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.detail(id),
        }),
      ]);
    },
  });
}