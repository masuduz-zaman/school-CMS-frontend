"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  createGalleryCategory,
  deleteGalleryCategory,
  deleteGalleryImage,
  getGalleryCategories,
  uploadGalleryImage,
} from "@/app/action/gallery";

type GalleryImage = {
  id: string;
  imageUrl: string;
  title?: string | null;
  description?: string | null;
};

type GalleryCategory = {
  id: string;
  name: string;
  slug: string;
  images: GalleryImage[];
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const titleFromFile = (file: File) => file.name.replace(/\.[^/.]+$/, "");

const input =
  "w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none " +
  "placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 " +
  "dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500";

const panel =
  "rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60";

export default function GalleryManager() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [albumName, setAlbumName] = useState("");
  const [creating, setCreating] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [deletingAlbum, setDeletingAlbum] = useState(false);

  const load = useCallback(async () => {
    const result = await getGalleryCategories();

    if (result.success) {
      const list = (result.data ?? []) as GalleryCategory[];
      setCategories(list);
      setSelectedId((current) =>
        current && list.some((c) => c.id === current) ? current : list[0]?.id ?? null,
      );
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selected = categories.find((c) => c.id === selectedId) ?? null;

  // Local previews for the files picked but not uploaded yet
  const previews = useMemo(
    () => files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })),
    [files],
  );
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  const uploading = progress !== null;

  /* ---------- Albums ---------- */

  const handleCreateAlbum = async (e: FormEvent) => {
    e.preventDefault();
    const name = albumName.trim();
    if (!name) {
      toast.error("Please enter an album name");
      return;
    }

    setCreating(true);
    const slug = slugify(name) || `album-${Date.now()}`;
    const result = await createGalleryCategory(name, slug);
    setCreating(false);

    if (result.success) {
      toast.success("Album created");
      setAlbumName("");
      await load();
      const created = result.data as GalleryCategory | null;
      if (created?.id) setSelectedId(created.id);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!selected) return;
    const count = selected.images.length;
    const warning = count
      ? `Delete "${selected.name}" and its ${count} image${count === 1 ? "" : "s"}? This can't be undone.`
      : `Delete "${selected.name}"? This can't be undone.`;
    if (!confirm(warning)) return;

    setDeletingAlbum(true);
    const result = await deleteGalleryCategory(selected.id);
    setDeletingAlbum(false);

    if (result.success) {
      toast.success("Album deleted");
      await load();
    } else {
      toast.error(result.message);
    }
  };

  /* ---------- Images ---------- */

  const handlePickFiles = (list: FileList | null) => {
    const picked = Array.from(list ?? []);
    const valid: File[] = [];

    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
      } else if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is larger than 10 MB`);
      } else {
        valid.push(file);
      }
    }
    setFiles(valid);
  };

  const clearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    let failed = 0;
    setProgress({ done: 0, total: files.length });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("image", file);
      formData.append("categoryId", selected.id);
      formData.append("title", titleFromFile(file));
      formData.append("description", description);

      const result = await uploadGalleryImage(formData);
      if (!result.success) {
        failed++;
        toast.error(`${file.name}: ${result.message}`);
      }
      setProgress({ done: i + 1, total: files.length });
    }

    setProgress(null);
    const uploaded = files.length - failed;
    if (uploaded > 0) {
      toast.success(`${uploaded} image${uploaded === 1 ? "" : "s"} uploaded`);
      setDescription("");
    }
    clearFiles();
    await load();
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Delete this image? This can't be undone.")) return;

    setDeletingImageId(id);
    const result = await deleteGalleryImage(id);
    setDeletingImageId(null);

    if (result.success) {
      setCategories((list) =>
        list.map((c) => ({ ...c, images: c.images.filter((img) => img.id !== id) })),
      );
      toast.success("Image deleted");
    } else {
      toast.error(result.message);
    }
  };

  /* ---------- Render ---------- */

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading gallery...
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Gallery</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Create albums, upload images from your device, and remove what you no longer need.
        </p>
      </div>

      {/* Create album */}
      <form onSubmit={handleCreateAlbum} className={`${panel} flex flex-col gap-3 sm:flex-row sm:items-end`}>
        <div className="flex-1">
          <label htmlFor="albumName" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            New album
          </label>
          <input
            id="albumName"
            className={input}
            placeholder="e.g. Annual Sports Day 2026"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {creating ? "Creating..." : "Create album"}
        </button>
      </form>

      {categories.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No albums yet. Create your first album above to start uploading images.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Album list */}
          <nav aria-label="Albums" className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {categories.map((c) => {
              const active = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedId(c.id);
                    clearFiles();
                  }}
                  aria-current={active}
                  className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-xs opacity-70">{c.images.length}</span>
                </button>
              );
            })}
          </nav>

          {/* Selected album */}
          {selected && (
            <section className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{selected.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selected.images.length} image{selected.images.length === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  onClick={handleDeleteAlbum}
                  disabled={deletingAlbum}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  {deletingAlbum ? "Deleting..." : "Delete album"}
                </button>
              </div>

              {/* Upload */}
              <form onSubmit={handleUpload} className={`${panel} space-y-4`}>
                <div>
                  <label
                    htmlFor="imageFiles"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Images
                  </label>
                  <input
                    ref={fileInputRef}
                    id="imageFiles"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePickFiles(e.target.files)}
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:text-slate-400 dark:file:bg-slate-800 dark:file:text-slate-200 dark:hover:file:bg-slate-700"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    You can select several images. Max 10 MB each.
                  </p>
                </div>

                {previews.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {previews.map((p) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={p.url}
                        src={p.url}
                        alt={p.name}
                        className="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                    ))}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="imageDescription"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Description{" "}
                    <span className="font-normal text-slate-400 dark:text-slate-500">
                      (optional, applied to every selected image)
                    </span>
                  </label>
                  <textarea
                    id="imageDescription"
                    rows={2}
                    className={input}
                    placeholder="Add a short caption..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  {uploading && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Uploading {progress.done}/{progress.total}...
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={uploading || files.length === 0}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {files.length > 1 ? `Upload ${files.length} images` : "Upload image"}
                  </button>
                </div>
              </form>

              {/* Images */}
              {selected.images.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  This album is empty. Choose images above to upload.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {selected.images.map((img) => (
                    <figure
                      key={img.id}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.imageUrl}
                        alt={img.title || selected.name}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <figcaption className="space-y-2 p-3">
                        {img.title && (
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                            {img.title}
                          </p>
                        )}
                        {img.description && (
                          <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                            {img.description}
                          </p>
                        )}
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          disabled={deletingImageId === img.id}
                          className="text-xs font-medium text-red-600 hover:underline disabled:opacity-60 dark:text-red-400"
                        >
                          {deletingImageId === img.id ? "Deleting..." : "Delete"}
                        </button>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
} 