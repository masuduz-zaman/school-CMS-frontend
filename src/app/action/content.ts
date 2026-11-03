"use server";

import { cookies } from "next/headers";
import type { ApiResponse, SchoolContent } from "@/types/notice";
const API_URL = process.env.BACKEND_URL;

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

export async function getAdminContent() {
  try {
    if (!API_URL) {
      throw new Error("BACKEND_URL is not configured");
    }

    const cookieHeader = await getCookieHeader();

    const response = await fetch(`${API_URL}/api/admin/get-content`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    const result: ApiResponse<SchoolContent | null> =
      await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to get content",
        data: null,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
      data: null,
    };
  }
}

// NEW: returns every published message (newest first)
export async function getAllAdminContents() {
  try {
    if (!API_URL) {
      throw new Error("BACKEND_URL is not configured");
    }

    const cookieHeader = await getCookieHeader();

    const response = await fetch(`${API_URL}/api/admin/get-all-content`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    const result: ApiResponse<SchoolContent[]> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to get contents",
        data: [] as SchoolContent[],
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data ?? [],
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
      data: [] as SchoolContent[],
    };
  }
}

export async function saveAdminContent(headTeacherMessage: string) {
  try {
    if (!API_URL) {
      throw new Error("BACKEND_URL is not configured");
    }

    const cookieHeader = await getCookieHeader();

    const response = await fetch(`${API_URL}/api/admin/create-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ headTeacherMessage }),
      cache: "no-store",
    });

    const result: ApiResponse<SchoolContent> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to save content",
        data: null,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
      data: null,
    };
  }
}

// NEW: deletes one message by id
export async function deleteAdminContent(id: string) {
  try {
    if (!API_URL) {
      throw new Error("BACKEND_URL is not configured");
    }

    const cookieHeader = await getCookieHeader();

    const response = await fetch(
      `${API_URL}/api/admin/delete-content/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Cookie: cookieHeader,
        },
        cache: "no-store",
      },
    );

    // Some DELETE handlers return no body, so parse defensively
    const result: Partial<ApiResponse<unknown>> = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete content",
      };
    }

    return {
      success: true,
      message: result.message || "Content deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
}