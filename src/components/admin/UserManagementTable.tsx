"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import {
  ManagedStudent,
  ManagedTeacher,
  UserStatus,
} from "@/types/user-management";

import {
  getStudents,
  getTeachers,
  updateStatus,
  deleteUser,
} from "@/services/user-management.service";

type Mode = "students" | "teachers";

interface Props {
  mode: Mode;
}

export default function UserManagementTable({ mode }: Props) {
  const [students, setStudents] = useState<ManagedStudent[]>([]);
  const [teachers, setTeachers] = useState<ManagedTeacher[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isStudent = mode === "students";

  // Load students or teachers
  const loadUsers = useCallback(async () => {
    setLoading(true);

    try {
      if (isStudent) {
        const result = await getStudents();
        if (result.success) setStudents(result.data);
        else toast.error(result.message);
      } else {
        const result = await getTeachers();
        if (result.success) setTeachers(result.data);
        else toast.error(result.message);
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [isStudent]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Student search
  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return students;

    return students.filter((student) => {
      const user = student.user;

      return [
        user.name,
        user.email,
        user.phone,
        student.class?.name,
        student.classRoll,
        student.parentPhone,
        user.status,
      ]
        .filter(Boolean)
        .some((item) => String(item).toLowerCase().includes(value));
    });
  }, [students, search]);

  // Teacher search
  const filteredTeachers = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return teachers;

    return teachers.filter((teacher) => {
      const user = teacher.user;
      const classNames = (teacher.classesAsClassTeacher ?? [])
        .map((item) => item.name)
        .join(" ");

      return [user.name, user.email, user.phone, classNames, user.status]
        .filter(Boolean)
        .some((item) => String(item).toLowerCase().includes(value));
    });
  }, [teachers, search]);

  // Statistics
  const totalUsers = isStudent ? students.length : teachers.length;

  const activeUsers = isStudent
    ? students.filter((item) => item.user.status === "ACTIVE").length
    : teachers.filter((item) => item.user.status === "ACTIVE").length;

  const suspendedUsers = totalUsers - activeUsers;

  // Change user status
  const handleStatusChange = async (
    userId: string,
    currentStatus: UserStatus,
  ) => {
    const nextStatus: UserStatus =
      currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    setUpdatingId(userId);
    const result = await updateStatus(userId, nextStatus);
    setUpdatingId(null);

    if (result.success) {
      toast.success(
        nextStatus === "ACTIVE"
          ? "User activated successfully"
          : "User suspended successfully",
      );
      await loadUsers();
    } else {
      toast.error(result.message);
    }
  };

  // Delete user
  const handleDelete = async (userId: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}? This can't be undone.`,
    );
    if (!confirmed) return;

    setUpdatingId(userId);
    const result = await deleteUser(userId);
    setUpdatingId(null);

    if (result.success) {
      toast.success("User deleted successfully");
      await loadUsers();
    } else {
      toast.error(result.message);
    }
  };

  const users = isStudent ? filteredStudents : filteredTeachers;

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isStudent ? "Student Management" : "Teacher Management"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and monitor all {isStudent ? "students" : "teachers"}.
          </p>
        </div>

        <button
          onClick={loadUsers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total {isStudent ? "students" : "teachers"}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {totalUsers}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
            {activeUsers}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Suspended</p>
          <h2 className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
            {suspendedUsers}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              isStudent
                ? "Search by name, email, phone, class or roll..."
                : "Search by name, email, phone or class..."
            }
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Showing {users.length} of {totalUsers} records
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        {loading ? (
          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            Loading {isStudent ? "students" : "teachers"}...
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            {search ? "No matching records found." : "No records available."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th className="px-5 py-4">Name / Email</th>
                  <th className="px-5 py-4">Phone</th>

                  {isStudent ? (
                    <>
                      <th className="px-5 py-4">Class</th>
                      <th className="px-5 py-4">Roll</th>
                      <th className="px-5 py-4">Parent Phone</th>
                    </>
                  ) : (
                    <th className="px-5 py-4">Class Teacher Of</th>
                  )}

                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {isStudent
                  ? filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="transition hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {student.user.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {student.user.email}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                          {student.user.phone || "—"}
                        </td>

                        <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                          {student.class?.name || "Not assigned"}
                        </td>

                        <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                          {student.classRoll || "—"}
                        </td>

                        <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                          {student.parentPhone || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={student.user.status} />
                        </td>

                        <td className="px-5 py-4">
                          <ActionButtons
                            status={student.user.status}
                            loading={updatingId === student.user.id}
                            onStatus={() =>
                              handleStatusChange(
                                student.user.id,
                                student.user.status,
                              )
                            }
                            onDelete={() =>
                              handleDelete(student.user.id, student.user.name)
                            }
                          />
                        </td>
                      </tr>
                    ))
                  : filteredTeachers.map((teacher) => (
                      <tr
                        key={teacher.id}
                        className="transition hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {teacher.user.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {teacher.user.email}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                          {teacher.user.phone || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(teacher.classesAsClassTeacher ?? []).length > 0 ? (
                              teacher.classesAsClassTeacher.map((item) => (
                                <span
                                  key={item.id}
                                  className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                >
                                  {item.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">
                                Not assigned
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={teacher.user.status} />
                        </td>

                        <td className="px-5 py-4">
                          <ActionButtons
                            status={teacher.user.status}
                            loading={updatingId === teacher.user.id}
                            onStatus={() =>
                              handleStatusChange(
                                teacher.user.id,
                                teacher.user.status,
                              )
                            }
                            onDelete={() =>
                              handleDelete(teacher.user.id, teacher.user.name)
                            }
                          />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Status badge
function StatusBadge({ status }: { status: UserStatus }) {
  const active = status === "ACTIVE";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
      }`}
    >
      {status}
    </span>
  );
}

// Action buttons
function ActionButtons({
  status,
  loading,
  onStatus,
  onDelete,
}: {
  status: UserStatus;
  loading: boolean;
  onStatus: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={onStatus}
        disabled={loading}
        title={status === "ACTIVE" ? "Suspend user" : "Activate user"}
        className="rounded-lg border border-gray-200 bg-white p-2 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
      >
        {status === "ACTIVE" ? (
          <ShieldAlert size={17} className="text-orange-600 dark:text-orange-400" />
        ) : (
          <ShieldCheck size={17} className="text-green-600 dark:text-green-400" />
        )}
      </button>

      <button
        onClick={onDelete}
        disabled={loading}
        title="Delete user"
        className="rounded-lg border border-gray-200 bg-white p-2 transition hover:bg-red-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-red-950"
      >
        <Trash2 size={17} className="text-red-600 dark:text-red-400" />
      </button>
    </div>
  );
}