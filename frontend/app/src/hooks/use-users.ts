
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getUsers,
  getUser,
  deleteUser,
} from "@/services/user.service";

import type { GetUsersParams } from "@/types/users.types";

export function useUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      queryClient.removeQueries({
        queryKey: ["user", id],
      });
    },
  });
}
