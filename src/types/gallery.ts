// Add these to types/content.ts (GalleryImage may already exist there)

export interface GalleryImage {
  id: string;
  imageUrl: string;
  title?: string | null;
  description?: string | null;
}

export interface GalleryAlbum {
  id: string;
  name: string;
  slug: string;
  images: GalleryImage[];
}