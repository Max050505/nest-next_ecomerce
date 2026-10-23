import { api } from "@/lib/api";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "USER" | "ADMIN";
}

interface AuthResponse {
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    return data.user;
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>("/users/me");

    return data;
  },

async register(payload: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<User> {
  try {
    const { data } = await api.post<AuthResponse>(
      "/auth/register",
      payload,
    );

    return data.user;
  } catch (error: any) {
    console.error("Registration error:");
    console.error("STATUS:", error?.response?.status);
    console.error("DATA:", error?.response?.data);
    console.error("ERROR:", error);

    throw error;
  }
},

  async refresh(): Promise<User> {
    const { data } = await api.post<AuthResponse>("/auth/refresh");

    return data.user;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
