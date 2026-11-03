export interface GalleryImage {
  id: string;
  imageUrl: string;
  title?: string | null;
  description?: string | null;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
}

export interface HeadTeacherMessage {
  headTeacherMessage: string;
  headTeacherName?: string;
  headTeacherImage?: string;
}