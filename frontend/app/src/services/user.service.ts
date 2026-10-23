import { api } from "@/lib/api";
import {
  GetUsersParams,
  PaginatedUsersResponse,
  User,
} from "@/types/users.types";

export async function getUsers(
  params?: GetUsersParams,
): Promise<PaginatedUsersResponse> {
  const { data } = await api.get<PaginatedUsersResponse>("/users", {
    params,
  });

  return data;
}

export async function getUser(id: string): Promise<User> {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/users/${id}`);
  return data;
}
