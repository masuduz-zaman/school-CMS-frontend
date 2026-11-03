
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  Users,
  GraduationCap,
  X,
  Loader2,
  BookOpen,
  Mail,
  Phone,
  User,
} from "lucide-react";

import { toast } from "sonner";

import {
  getAllClasses,
  createClass,
} from "@/services/class.service";

import type { SchoolClass } from "@/types/class";

export default function ClassManagementPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [selectedClass, setSelectedClass] =
    useState<SchoolClass | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAllClasses();
      setClasses(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load classes"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleCreateClass = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Class name is required");
      return;
    }

    try {
      setCreating(true);

      await createClass({
        name: name.trim(),
        description: description.trim(),
      });

      toast.success("Class created successfully");

      setName("");
      setDescription("");
      setShowForm(false);

      await fetchClasses();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create class"
      );
    } finally {
      setCreating(false);
    }
  };

  const totalStudents = classes.reduce(
    (total, item) => total + item.totalStudents,
    0
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Class Management
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage classes and their students.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchClasses}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Class
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Total Classes
            </p>
            <BookOpen className="text-blue-500" size={22} />
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {loading ? "—" : classes.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Total Students
            </p>
            <Users className="text-green-500" size={22} />
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {loading ? "—" : totalStudents}
          </p>
        </div>
      </div>

      {/* Create Class Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Create New Class
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCreateClass}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Class Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Example: Class 6"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Enter class description"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Create Class
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Classes */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          All Classes
        </h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-blue-600" size={30} />
          </div>
        ) : classes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
            <GraduationCap
              size={40}
              className="mx-auto text-slate-400"
            />
            <p className="mt-3 font-semibold text-slate-700 dark:text-white">
              No classes found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Create your first class.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {classes.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                    <GraduationCap size={25} />
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    {item.totalStudents} Students
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  {item.name}
                </h3>

                <p className="mt-1 min-h-5 text-sm text-slate-500 dark:text-slate-400">
                  {item.description || "No description"}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedClass(item)}
                    className="w-full rounded-xl bg-blue-50 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                  >
                    View Students
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Students Modal */}
      {selectedClass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedClass(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedClass.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedClass.totalStudents} Students
                </p>
              </div>

              <button
                onClick={() => setSelectedClass(null)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto p-5">
              {selectedClass.students.length === 0 ? (
                <div className="py-12 text-center">
                  <Users
                    size={38}
                    className="mx-auto text-slate-400"
                  />
                  <p className="mt-3 font-medium text-slate-700 dark:text-white">
                    No students in this class
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800">
                      <tr>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Parent Phone</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedClass.students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <User
                                size={17}
                                className="text-slate-400"
                              />
                              <span className="font-medium text-slate-800 dark:text-white">
                                {student.user.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <Mail size={15} />
                              {student.user.email}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <Phone size={15} />
                              {student.user.phone || "N/A"}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                            {student.parentPhone || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
