
export interface ClassStudent {
  id: string;
  parentPhone: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export interface SchoolClass {
  id: string;
  name: string;
  description: string | null;
  totalStudents: number;
  students: ClassStudent[];
}

export interface CreateClassPayload {
  name: string;
  description?: string;
}
