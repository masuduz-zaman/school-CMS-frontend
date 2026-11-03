import type { SchoolContent, ApiResponse } from "@/types/notice";

async function getPublicContent(): Promise<SchoolContent | null> {
  const API_URL = process.env.BACKEND_URL;

  if (!API_URL) return null;

  try {
    const response = await fetch(`${API_URL}/api/content`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const result: ApiResponse<SchoolContent | null> =
      await response.json();

    return result.data;
  } catch {
    return null;
  }
}

export default async function HeadTeacherMessage() {
  const content = await getPublicContent();

  if (!content?.headTeacherMessage) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="rounded-2xl border p-6 md:p-10">
        <h2 className="mb-5 text-2xl font-bold">
          Head Teacher&apos;s Message
        </h2>

        <p className="whitespace-pre-line leading-8 text-gray-600 dark:text-gray-300">
          {content.headTeacherMessage}
        </p>

        {content.updateBy?.name && (
          <p className="mt-6 font-semibold">
            {content.updateBy.name}
          </p>
        )}
      </div>
    </section>
  );
}