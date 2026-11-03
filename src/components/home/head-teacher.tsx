
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Quote,
  Loader2,
  RefreshCw,
  GraduationCap,
  CalendarDays,
} from "lucide-react";

import { apiRequest } from "@/lib/api";

interface HeadTeacherContent {
  id: string;
  headTeacherMessage: string;
  updatedAt?: string;
}

export default function HeadTeacherSection() {
  const [message, setMessage] = useState<HeadTeacherContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHeadTeacherMessage = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest<any>("/api/admin/content", {
        method: "GET",
      });

      const data = response?.data;

      if (
        !response?.success ||
        !data ||
        typeof data.headTeacherMessage !== "string" ||
        !data.headTeacherMessage.trim()
      ) {
        setMessage(null);
        return;
      }

      setMessage(data);
    } catch (err) {
      console.error("Head Teacher Message Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load head teacher message"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeadTeacherMessage();
  }, [fetchHeadTeacherMessage]);

  return (
    <section
      id="head-teacher-message"
      className="relative overflow-hidden bg-white py-20 dark:bg-[#080e1b] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Section heading */}
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Leadership & Inspiration
          </p>

          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Message from Head Teacher
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            A message of encouragement, guidance and inspiration
            for our students, teachers and guardians.
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
            <Loader2 className="h-9 w-9 animate-spin text-blue-600 dark:text-blue-400" />

            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              Loading message...
            </p>
          </div>
        ) : error ? (
          /* Error state */
          <div className="rounded-3xl border border-red-200 bg-slate-50 px-6 py-14 text-center dark:border-red-500/20 dark:bg-white/[0.03]">
            <Quote
              size={40}
              className="mx-auto text-red-500"
            />

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Unable to Load Message
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              {error}
            </p>

            <button
              onClick={fetchHeadTeacherMessage}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : message ? (
          /* Message content */
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">

            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative grid items-stretch md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr]">

              {/* Left profile panel */}
              <div className="flex flex-col items-center justify-center border-b border-slate-200 bg-blue-600/[0.04] px-6 py-10 text-center dark:border-white/10 dark:bg-blue-500/[0.04] md:border-b-0 md:border-r">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-blue-500/20 bg-blue-100 text-blue-600 shadow-inner dark:bg-blue-500/10 dark:text-blue-400">
                  <GraduationCap size={58} strokeWidth={1.4} />
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-slate-900 dark:text-white">
                  Head Teacher
                </h3>

                <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  School Leadership
                </p>

                {message.updatedAt && (
                  <div className="mt-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                    <CalendarDays size={14} />
                    Updated{" "}
                    {new Date(message.updatedAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </div>
                )}
              </div>

              {/* Right message panel */}
              <div className="relative px-6 py-9 sm:px-10 sm:py-12 lg:px-14">

                <Quote
                  size={46}
                  strokeWidth={1.5}
                  className="text-blue-600/70 dark:text-blue-400/70"
                />

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                  A Message of Inspiration
                </p>

                <div className="mt-6 whitespace-pre-line break-words text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg sm:leading-9">
                  {message.headTeacherMessage}
                </div>

                <div className="mt-9 flex items-center gap-3 border-t border-slate-200 pt-6 dark:border-white/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <GraduationCap size={21} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      Head Teacher
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Our School
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.03]">
            <Quote
              size={42}
              className="mx-auto text-blue-500"
            />

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Message Coming Soon
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              The head teacher's message will be available here soon.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
