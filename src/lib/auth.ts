import { apiRequest } from "@/lib/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginUser(payload: LoginPayload) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser() {
  return apiRequest("/api/me", {
    method: "GET",
  });
}