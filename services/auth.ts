import { apiClient } from "@/lib/api-client";
import type { AuthSession, LoginPayload, RegisterPayload } from "@/lib/types";

export async function registerUser(payload: RegisterPayload): Promise<AuthSession> {
  return apiClient.post<AuthSession>("/auth/register", payload);
}

export async function loginUser(payload: LoginPayload): Promise<AuthSession> {
  return apiClient.post<AuthSession>("/auth/login", payload);
}
