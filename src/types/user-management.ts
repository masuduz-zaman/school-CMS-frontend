// types/user-management.ts

export type UserStatus = "ACTIVE" | "SUSPENDED";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: UserStatus;
  createdAt: string;
};

export interface ManagedStudent {
  id: string;
  classRoll: string | number | null;
  parentPhone: string | null;
  class: { id: string; name: string } | null;
  user: ManagedUser;
}

export interface ManagedTeacher {
  id: string;
  user: ManagedUser;
  classesAsClassTeacher: { id: string; name: string }[];
}