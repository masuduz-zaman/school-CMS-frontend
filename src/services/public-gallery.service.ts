// services/public-gallery.service.ts
// Plain server-side fetch (no "use server", no cookies): the gallery is public.
import type { GalleryAlbum } from "@/types/gallery";

const API_URL = process.env.BACKEND_URL;

export async function getPublicGallery(): Promise<GalleryAlbum[]> {
  try {
    if (!API_URL) throw new Error("BACKEND_URL is not configured");

    const response = await fetch(`${API_URL}/api/public/gallery`, {
      // Re-fetch at most once a minute, so uploads show up quickly
      // without hitting the backend on every visit.
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const result = await response.json();
    return (result.data ?? []) as GalleryAlbum[];
  } catch {
    // The homepage must still render if the gallery can't load.
    return [];
  }
}