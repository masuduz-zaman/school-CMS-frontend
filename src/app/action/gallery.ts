"use server";

import { cookies } from "next/headers";

const API_URL = process.env.BACKEND_URL;

type ActionResult<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}


async function request<T>(
  path: string,
  init: RequestInit = {},
  fallbackMessage = "Request failed",
): Promise<ActionResult<T>> {
  try {
    if (!API_URL) {
      throw new Error("BACKEND_URL is not configured");
    }

    const cookieHeader = await getCookieHeader();

    const response = await fetch(`${API_URL}/api/admin${path}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    const result = await response.json().catch(() => ({}));

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

export async function getGalleryCategories() {
  return request<unknown[]>(
    "/categories",
    { method: "GET" },
    "Failed to load albums",
  );
}

export async function createGalleryCategory(name: string, slug: string) {
  return request<unknown>(
    "/category",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    },
    "Failed to create album",
  );
}

export async function deleteGalleryCategory(id: string) {
  return request<null>(
    `/category/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    "Failed to delete album",
  );
}

// formData fields: image (File), categoryId, title?, description?
export async function uploadGalleryImage(formData: FormData) {
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "Please select an image", data: null };
  }

  const body = new FormData();
  body.append("image", file, file.name); // field name must match upload.single("image")
  body.append("categoryId", String(formData.get("categoryId") ?? ""));
  body.append("title", String(formData.get("title") ?? ""));

  const description = String(formData.get("description") ?? "").trim();
  if (description) body.append("description", description);

  // No Content-Type header here: fetch sets the multipart boundary itself.
  return request<unknown>(
    "/image",
    { method: "POST", body },
    "Failed to upload image",
  );
}

export async function deleteGalleryImage(id: string) {
  return request<null>(
    `/image/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    "Failed to delete image",
  );
}