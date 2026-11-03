
import { apiRequest } from "@/lib/api";
import type {
  SchoolClass,
  CreateClassPayload,
} from "@/types/class";

export const getAllClasses = async (): Promise<SchoolClass[]> => {
  const response = await apiRequest<unknown>(
    "/api/admin/all-class",
    {
      method: "GET",
    }
  );

  if (Array.isArray(response)) {
    return response as SchoolClass[];
  }

  if (response && typeof response === "object") {
    const result = response as Record<string, unknown>;

    if (Array.isArray(result.data)) {
      return result.data as SchoolClass[];
    }

    if (Array.isArray(result.result)) {
      return result.result as SchoolClass[];
    }

    if (Array.isArray(result.classes)) {
      return result.classes as SchoolClass[];
    }

    if (
      result.data &&
      typeof result.data === "object"
    ) {
      const nested = result.data as Record<string, unknown>;

      if (Array.isArray(nested.classes)) {
        return nested.classes as SchoolClass[];
      }

      if (Array.isArray(nested.result)) {
        return nested.result as SchoolClass[];
      }
    }
  }

  console.error("Unexpected classes API response:", response);

  return [];
};

export const createClass = async (
  payload: CreateClassPayload
) => {
  return apiRequest("/api/admin/add-class", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
