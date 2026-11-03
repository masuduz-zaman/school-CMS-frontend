"use client";

// app/dashboard/admission-notices/page.tsx
import { FormEvent, useCallback, useEffect, useState } from "react";

const API = process.env.BACKEND_URL ?? "http://localhost:5000/api";

type Notice = {
  id: string; 
  title: string;
  content: string;
  publishedAt: string;
  expiresAt: string;
  createdBy?: { name: string };
};

type Status = "scheduled" | "live" | "expired";

const getStatus = (n: Notice): Status => {
  const now = Date.now();
  if (new Date(n.publishedAt).getTime() > now) return "scheduled";
  if (new Date(n.expiresAt).getTime() < now) return "expired";
  return "live";
};

const statusStyle: Record<Status, string> = {
  live: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  scheduled: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  expired: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

const statusLabel: Record<Status, string> = {
  live: "Live",
  scheduled: "Scheduled",
  expired: "Expired",
};

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

const emptyForm = { title: "", content: "", publishDate: "", durationInDays: 30 };

export default function AdmissionNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState<"all" | Status>("all");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      // Admin route: returns all notices (including scheduled and expired)
      const res = await fetch(`${API}/notice`, { credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Failed to load notices");
      setNotices(json.data ?? json);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        title: form.title.trim(),
        content: form.content.trim(),
        durationInDays: Number(form.durationInDays) || 30,
        // If empty, the backend publishes immediately
        ...(form.publishDate && {
          publishDate: new Date(form.publishDate).toISOString(),
        }),
      };
      const res = await fetch(`${API}/admin/create-notice`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Failed to create notice");
      setForm(emptyForm);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this notice? This can't be undone.")) return;
    const prev = notices;
    setNotices((list) => list.filter((n) => n.id !== id)); // optimistic update
    try {
      const res = await fetch(`${API}/admin/notice/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error((await res.json()).message ?? "Failed to delete notice");
    } catch (e) {
      setNotices(prev);
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const visible = notices.filter((n) => filter === "all" || getStatus(n) === filter);

  const input =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 " +
    "placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 " +
    "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 " +
    "dark:focus:border-indigo-400 dark:focus:ring-indigo-500/30 dark:[color-scheme:dark]";

  const label = "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Admission notices
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Create, schedule, and delete notices. Expired notices are automatically hidden from the public page.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {/* Create form */}
      <form
        onSubmit={onCreate}
        className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60 md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <label className={label} htmlFor="title">Title</label>
          <input
            id="title"
            required
            className={input}
            placeholder="e.g. Fall 2026 admission is open"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className={label} htmlFor="content">Content</label>
          <textarea
            id="content"
            required
            rows={4}
            className={input}
            placeholder="Write the notice details here"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <div>
          <label className={label} htmlFor="publishDate">
            Publish date{" "}
            <span className="font-normal text-slate-400 dark:text-slate-500">
              (leave empty to publish now)
            </span>
          </label>
          <input
            id="publishDate"
            type="datetime-local"
            className={input}
            value={form.publishDate}
            onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
          />
        </div>

        <div>
          <label className={label} htmlFor="duration">
            Visible for (days)
          </label>
          <input
            id="duration"
            type="number"
            min={1}
            className={input}
            value={form.durationInDays}
            onChange={(e) => setForm({ ...form, durationInDays: Number(e.target.value) })}
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            {saving ? "Saving..." : form.publishDate ? "Schedule notice" : "Publish notice"}
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "live", "scheduled", "expired"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              filter === f
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {f === "all" ? "All" : statusLabel[f]}
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading notices...</p>
      ) : visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No notices here yet. Use the form above to create one.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((n) => {
            const s = getStatus(n);
            return (
              <article
                key={n.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-slate-900 dark:text-slate-50">{n.title}</h2>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[s]}`}
                  >
                    {statusLabel[s]}
                  </span>
                </div>

                <p className="line-clamp-4 flex-1 whitespace-pre-line text-sm text-slate-600 dark:text-slate-400">
                  {n.content}
                </p>

                <dl className="mt-4 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between gap-2">
                    <dt>Publishes</dt>
                    <dd>{fmt(n.publishedAt)}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Expires</dt>
                    <dd>{fmt(n.expiresAt)}</dd>
                  </div>
                  {n.createdBy?.name && (
                    <div className="flex justify-between gap-2">
                      <dt>Created by</dt>
                      <dd>{n.createdBy.name}</dd>
                    </div>
                  )}
                </dl>

                <button
                  onClick={() => onDelete(n.id)}
                  className="mt-4 self-start rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  Delete
                </button>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}