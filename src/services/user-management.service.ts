"use server";

// services/user-management.service.ts
import { cookies } from "next/headers";
import type { ApiResponse } from "@/types/notice";
import type {
  ManagedStudent,
  ManagedTeacher,
  UserStatus,
} from "@/types/user-management";

const API_URL = process.env.BACKEND_URL;

async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

// Every function returns { success, message, data } instead of throwing,
// because error messages thrown inside server actions are hidden in production.
async function request<T>(
  path: string,
  init: RequestInit,
  fallbackMessage: string,
): Promise<{ success: boolean; message: string; data: T | null }> {
  try {
    if (!API_URL) throw new Error("BACKEND_URL is not configured");

    const cookieHeader = await getCookieHeader();

    const response = await fetch(`${API_URL}/api/admin${path}`, {
      ...init,
      headers: { ...init.headers, Cookie: cookieHeader },
      cache: "no-store",
    });

    const result: Partial<ApiResponse<T>> = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: result.message || fallbackMessage,
        data: null,
      };
    }

    return {
      success: true,
      message: result.message || "Done",
      data: (result.data ?? null) as T | null,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    };
  }
}

export async function getStudents() {
  const res = await request<ManagedStudent[]>(
    "/all-students",
    { method: "GET" },
    "Failed to load students",
  );
  return { ...res, data: res.data ?? [] };
}

export async function getTeachers() {
  const res = await request<ManagedTeacher[]>(
    "/all-teachers",
    { method: "GET" },
    "Failed to load teachers",
  );
  return { ...res, data: res.data ?? [] };
}

export async function updateStatus(userId: string, status: UserStatus) {
  return request<unknown>(
    `/user-status/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
    "Failed to update status",
  );
}

export async function deleteUser(userId: string) {
  return request<null>(
    `/user/${encodeURIComponent(userId)}`,
    { method: "DELETE" },
    "Failed to delete user",
  );
}