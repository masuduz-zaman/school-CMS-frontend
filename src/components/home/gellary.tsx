
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Images,
  Loader2,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  ArrowLeft,
} from "lucide-react";

import { GalleryAlbum } from "@/types/gallery";
import { apiRequest } from "@/lib/api";

export default function GallerySection() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAlbum, setSelectedAlbum] =
    useState<GalleryAlbum | null>(null);

  const [selectedImageIndex, setSelectedImageIndex] =
    useState<number | null>(null);

  // Fetch albums from backend
  const fetchGalleryAlbums = async () => {
    try {
      setLoading(true);
      setError("");

      const response = (await apiRequest("/api/gallery-albums", {
        method: "GET",
      })) as any;

      const data =
        response?.data?.albums ??
        response?.data?.categories ??
        response?.data ??
        [];

      if (!Array.isArray(data)) {
        throw new Error("Invalid gallery response");
      }

      setAlbums(data);
    } catch (err) {
      console.error("Gallery fetch error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load gallery albums"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryAlbums();
  }, []);

  // Total images
  const totalImages = useMemo(
    () =>
      albums.reduce(
        (total, album) => total + (album.images?.length ?? 0),
        0
      ),
    [albums]
  );

  // Selected album images
  const albumImages = selectedAlbum?.images ?? [];

  // Open album
  const openAlbum = (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    setSelectedImageIndex(null);
  };

  // Close album modal
  const closeAlbum = () => {
    setSelectedAlbum(null);
    setSelectedImageIndex(null);
  };

  // Open image preview
  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Close image preview
  const closeImage = () => {
    setSelectedImageIndex(null);
  };

  // Previous image
  const previousImage = () => {
    if (selectedImageIndex === null || albumImages.length === 0) return;

    setSelectedImageIndex((current) =>
      current === null
        ? null
        : (current - 1 + albumImages.length) % albumImages.length
    );
  };

  // Next image
  const nextImage = () => {
    if (selectedImageIndex === null || albumImages.length === 0) return;

    setSelectedImageIndex((current) =>
      current === null
        ? null
        : (current + 1) % albumImages.length
    );
  };

  // Keyboard navigation
  useEffect(() => {
    if (!selectedAlbum) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selectedImageIndex !== null) {
          closeImage();
        } else {
          closeAlbum();
        }
      }

      if (selectedImageIndex !== null) {
        if (event.key === "ArrowLeft") previousImage();
        if (event.key === "ArrowRight") nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedAlbum, selectedImageIndex, albumImages.length]);

  return (
    <>
      <section
        id="gallery"
        className="relative overflow-hidden bg-slate-50 py-20 dark:bg-[#080e1b] sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          {/* Heading */}
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Our Memories
              </p>

              <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                Life at Our School
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-400">
                Explore memorable moments and events from our school community.
              </p>
            </div>

            {!loading && !error && albums.length > 0 && (
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <Images size={18} />
                <span>
                  {albums.length} Albums · {totalImages} Photos
                </span>
              </div>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
              <Loader2 className="h-9 w-9 animate-spin text-blue-600 dark:text-blue-400" />

              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                Loading albums...
              </p>
            </div>
          ) : error ? (
            /* Error */
            <div className="rounded-3xl border border-red-200 bg-white px-6 py-14 text-center dark:border-red-500/20 dark:bg-white/[0.03]">
              <Images size={40} className="mx-auto text-red-500" />

              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                Unable to Load Gallery
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                {error}
              </p>

              <button
                onClick={fetchGalleryAlbums}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          ) : albums.length > 0 ? (
            /* Album cards */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {albums.map((album) => {
                const coverImage = album.images?.[0];

                return (
                  <button
                    key={album.id}
                    type="button"
                    onClick={() => openAlbum(album)}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    {/* Cover */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-800">
                      {coverImage ? (
                        <img
                          src={coverImage.imageUrl}
                          alt={coverImage.title || album.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon
                            size={48}
                            className="text-slate-400"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                        <Images size={14} />
                        {album.images?.length ?? 0} Photos
                      </div>

                      <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
                        View Album
                      </div>
                    </div>

                    {/* Album information */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {album.name}
                      </h3>

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        View photos from this album
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Empty */
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.03]">
              <Images
                size={42}
                className="mx-auto text-blue-500"
              />

              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                Gallery Coming Soon
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                School albums will be available here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Album Modal */}
      {selectedAlbum && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-2 backdrop-blur-sm sm:p-5"
          onClick={closeAlbum}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedAlbum.name} album`}
            className="relative flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl dark:bg-[#101827] sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Images size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                    {selectedAlbum.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {albumImages.length} Photos
                  </p>
                </div>
              </div>

              <button
                onClick={closeAlbum}
                aria-label="Close album"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-red-100 hover:text-red-600 dark:bg-white/10 dark:text-white dark:hover:bg-red-500/20"
              >
                <X size={21} />
              </button>
            </div>

            {/* Modal content */}
            <div className="overflow-y-auto p-4 sm:p-7">
              {albumImages.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {albumImages.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => openImage(index)}
                      className="group relative overflow-hidden rounded-xl bg-slate-200 text-left dark:bg-slate-800"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={image.imageUrl}
                          alt={image.title || selectedAlbum.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      {image.title && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
                          <p className="text-sm font-semibold text-white">
                            {image.title}
                          </p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <Images
                    size={42}
                    className="mx-auto text-slate-400"
                  />
                  <p className="mt-4 text-slate-500 dark:text-slate-400">
                    No photos available in this album.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full image preview */}
      {selectedAlbum && selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4"
          onClick={closeImage}
        >
          <button
            onClick={closeImage}
            aria-label="Close image"
            className="absolute right-5 top-5 z-20 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              previousImage();
            }}
            aria-label="Previous image"
            className="absolute left-2 z-20 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            className="flex max-h-full max-w-5xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={albumImages[selectedImageIndex].imageUrl}
              alt={
                albumImages[selectedImageIndex].title ||
                selectedAlbum.name
              }
              className="max-h-[78vh] max-w-full rounded-lg object-contain"
            />

            <div className="mt-4 text-center text-white">
              {albumImages[selectedImageIndex].title && (
                <h3 className="font-semibold">
                  {albumImages[selectedImageIndex].title}
                </h3>
              )}

              {albumImages[selectedImageIndex].description && (
                <p className="mt-1 max-w-2xl text-sm text-white/70">
                  {albumImages[selectedImageIndex].description}
                </p>
              )}

              <p className="mt-2 text-xs text-white/50">
                {selectedImageIndex + 1} / {albumImages.length}
              </p>
            </div>
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              nextImage();
            }}
            aria-label="Next image"
            className="absolute right-2 z-20 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </>
  );
}
