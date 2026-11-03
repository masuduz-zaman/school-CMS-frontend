"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  getAllAdminContents,
  saveAdminContent,
  deleteAdminContent,
} from "@/app/action/content";

type ContentItem = {
  id: string;
  headTeacherMessage: string;
  updatedAt: string;
  updateBy?: { id: string; name: string; email: string };
};

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

export default function ContentManager() {
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadContents = async () => {
    const result = await getAllAdminContents();
    if (result.success) {
      setItems(result.data ?? []);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadContents();
  }, []);

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    startTransition(async () => {
      const result = await saveAdminContent(message.trim());

      if (result.success) {
        toast.success(result.message || "Message published");
        setMessage("");
        await loadContents();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message? This can't be undone.")) return;

    setDeletingId(id);
    const result = await deleteAdminContent(id);
    setDeletingId(null);

    if (result.success) {
      setItems((list) => list.filter((item) => item.id !== id));
      toast.success(result.message || "Message deleted");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          School content
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage the messages displayed on the public homepage. The most recently
          updated message is the one visitors see.
        </p>
      </div>

      {/* Create */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <label
          htmlFor="headTeacherMessage"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Head teacher message
        </label>

        <textarea
          id="headTeacherMessage"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write the message here..."
          rows={7}
          className="w-full resize-y rounded-lg border border-slate-300 bg-transparent p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Publishing..." : "Publish message"}
          </button>
        </div>
      </div>

      {/* List */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Published messages
        </h2>

        {loading ? (
          <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading messages...
          </p>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No messages yet. Publish one using the form above.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item, index) => (
              <article
                key={item.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60"
              >
                {index === 0 && (
                  <span className="mb-3 w-fit rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                    Shown on homepage
                  </span>
                )}

                <p className="line-clamp-6 flex-1 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
                  {item.headTeacherMessage}
                </p>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <p>{item.updateBy?.name ?? "Unknown"}</p>
                    <p>{fmt(item.updatedAt)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}