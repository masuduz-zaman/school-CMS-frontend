export type RequestStatus =
  | "PENDING"
  | "APPROVED"
  | "CANCELLED"
  | "BLOCKED"
  | "REJECTED";

export interface RegistrationRequest {
  id: string;
  name: string;
  email: string;
  requestType: "STUDENT" | "TEACHER";
  status: RequestStatus;

  classId?: string | null;
  className?: string | null;
  subject?: string | null;

  phone?: string | null;
  parentPhone?: string | null;
  classRoll?: string | null;

  createdAt?: string;
}