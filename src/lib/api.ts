
import { ApiResponse, Notice } from "@/types/notice";

const BASE_URL =
  process.env.BACKEND_URL || "http://localhost:5000";

// Generic API request
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `Request failed: ${response.status}`
    );
  }

  return result as T;
}

// GET Notices
export async function getNotices(): Promise<Notice[]> {
  try {
    const result = await apiRequest<ApiResponse<Notice[]>>(
      "/api/notice",
      { method: "GET" }
    );

    if (!result.success || !Array.isArray(result.data)) {
      return [];
    }

    return result.data;
  } catch (error) {
    console.error("Notice API Error:", error);
    return [];
  }
}
