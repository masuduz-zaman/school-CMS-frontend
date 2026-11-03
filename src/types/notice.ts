export interface SchoolContent {
  id: string;
  headTeacherMessage: string;
  updatedById: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;
   updateBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}