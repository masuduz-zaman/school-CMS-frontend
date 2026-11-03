
"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Save,
  X,
  UserRound,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Plus,
  Hash,
  Users,
  ShieldCheck,
} from "lucide-react";

import ThemeToggle from "@/components/ui/theme-toggle";
import { apiRequest } from "@/lib/api";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "ADMIN" | "STUDENT" | "TEACHER";
  status?: "ACTIVE" | "SUSPENDED";
  createdAt?: string;

  student?: {
    classRoll?: string | number | null;
    parentPhone?: string | null;
    class?: { id: string; name: string } | null;
  } | null;

  teacher?: {
    classesAsClassTeacher?: { id: string; name: string }[];
  } | null;
}

type FormData = {
  name: string;
  phone: string;
  classRoll: string;
  parentPhone: string;
};

const roleLabel = {
  ADMIN: "Admin",
  STUDENT: "Student",
  TEACHER: "Teacher",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white";

function InfoItem({
  label,
  value,
  icon,
  action,
}: {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-100 py-4 last:border-0 dark:border-white/10">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <div className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-white">
            {value || "—"}
          </div>
        </div>
      </div>

      {action}
    </div>
  );
}

function SectionCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-6">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
          {icon}
        </div>

        <div>
          <h2 className="font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [addingField, setAddingField] = useState<
    "classRoll" | "parentPhone" | null
  >(null);

  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    classRoll: "",
    parentPhone: "",
  });

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = (await apiRequest("/api/me", {
          method: "GET",
        })) as any;

        const data = response?.data?.user ?? response?.data ?? null;

        if (!data?.id) {
          throw new Error("Not logged in");
        }

        if (active) {
          setProfile(data as Profile);
        }
      } catch {
        if (active) {
          router.replace("/login");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [router]);

  const startEditing = () => {
    if (!profile) return;

    setForm({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      classRoll: String(profile.student?.classRoll ?? ""),
      parentPhone: profile.student?.parentPhone ?? "",
    });

    setEditing(true);
    setAddingField(null);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    if (!profile || saving) return;

    const name = form.name.trim();

    if (!name) {
      toast.error("Name can't be empty");
      return;
    }

    try {
      setSaving(true);

      const response = (await apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify({
          name,
          phone: form.phone.trim(),
        }),
      })) as any;

      const updated = response?.data?.user ?? response?.data ?? {};

      setProfile({
        ...profile,
        ...updated,
        name,
        phone: form.phone.trim() || null,
      });

      toast.success(response?.message || "Profile updated successfully");
      setEditing(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddField = async (event: FormEvent) => {
    event.preventDefault();

    if (!profile || !addingField || saving) return;

    const value = form[addingField].trim();

    if (!value) {
      toast.error("Please enter a value");
      return;
    }

    try {
      setSaving(true);

      // Backend must accept these student fields in PUT /api/profile.
      const payload =
        addingField === "classRoll"
          ? { classRoll: value }
          : { parentPhone: value };

      const response = (await apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      })) as any;

      const updated = response?.data?.user ?? response?.data ?? {};

      setProfile((current) => {
        if (!current) return current;

        return {
          ...current,
          ...updated,
          student: {
            ...current.student,
            ...(addingField === "classRoll"
              ? { classRoll: value }
              : { parentPhone: value }),
            ...(updated.student ?? {}),
          },
        };
      });

      toast.success(response?.message || "Information added successfully");
      setAddingField(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add information"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await apiRequest("/api/auth/logout", {
        method: "POST",
      });

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
      setLoggingOut(false);
    }
  };

  if (loading || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#080e1b]">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  const classTeacherOf =
    profile.teacher?.classesAsClassTeacher?.map((c) => c.name).join(", ") ||
    "";

  const hasClassRoll =
    profile.student?.classRoll !== null &&
    profile.student?.classRoll !== undefined &&
    String(profile.student.classRoll).trim() !== "";

  const hasParentPhone = Boolean(
    profile.student?.parentPhone?.trim()
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-[#080e1b] sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        {/* Top navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft size={17} />
            Back to Homepage
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white disabled:opacity-50 dark:text-red-400 dark:hover:text-white"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>

        {/* Profile heading */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/70">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl font-bold text-white shadow-lg sm:h-20 sm:w-20 sm:text-3xl">
                  {profile.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-blue-100">
                    My Profile
                  </p>

                  <h1 className="mt-1 break-words text-xl font-extrabold text-white sm:text-2xl">
                    {profile.name}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                      {roleLabel[profile.role]}
                    </span>

                    {profile.status && (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          profile.status === "ACTIVE"
                            ? "bg-green-400/20 text-green-100"
                            : "bg-red-400/20 text-red-100"
                        }`}
                      >
                        {profile.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!editing && (
                <button
                  onClick={startEditing}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 text-sm text-slate-500 dark:text-slate-400 sm:px-8">
            <span className="flex min-w-0 items-center gap-2">
              <Mail size={15} className="shrink-0" />
              <span className="break-all">{profile.email}</span>
            </span>

            {profile.createdAt && (
              <span className="flex items-center gap-2">
                <CalendarDays size={15} />
                Joined{" "}
                {new Date(profile.createdAt).toLocaleDateString("en-GB", {
                  dateStyle: "medium",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Edit existing information */}
        {editing ? (
          <form
            onSubmit={handleSave}
            className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-7"
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit Profile
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Update your existing profile information.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  value={profile.email}
                  disabled
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  Email Can't be changed here.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Personal information */}
            <SectionCard
              title="Personal Information"
              description="Your basic account details"
              icon={<UserRound size={20} />}
            >
              <InfoItem
                label="Full Name"
                value={profile.name}
                icon={<UserRound size={17} />}
              />

              <InfoItem
                label="Email Address"
                value={profile.email}
                icon={<Mail size={17} />}
              />

              <InfoItem
                label="Phone Number"
                value={profile.phone}
                icon={<Phone size={17} />}
              />
            </SectionCard>

            {/* Role-specific information */}
            {profile.role === "STUDENT" && (
              <SectionCard
                title="Student Information"
                description="Your academic and guardian details"
                icon={<GraduationCap size={20} />}
              >
                <InfoItem
                  label="Class"
                  value={profile.student?.class?.name}
                  icon={<BookOpen size={17} />}
                />

                <InfoItem
                  label="Class Roll"
                  value={
                    hasClassRoll ? profile.student?.classRoll : null
                  }
                  icon={<Hash size={17} />}
                  action={
                    !hasClassRoll ? (
                      <button
                        onClick={() => setAddingField("classRoll")}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-500/20 dark:text-blue-400"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    ) : null
                  }
                />

                <InfoItem
                  label="Parent Phone"
                  value={
                    hasParentPhone
                      ? profile.student?.parentPhone
                      : null
                  }
                  icon={<Users size={17} />}
                  action={
                    !hasParentPhone ? (
                      <button
                        onClick={() => setAddingField("parentPhone")}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-500/20 dark:text-blue-400"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    ) : null
                  }
                />
              </SectionCard>
            )}

            {profile.role === "TEACHER" && (
              <SectionCard
                title="Teacher Information"
                description="Your teaching responsibilities"
                icon={<GraduationCap size={20} />}
              >
                <InfoItem
                  label="Class Teacher Of"
                  value={classTeacherOf || "Not assigned"}
                  icon={<BookOpen size={17} />}
                />
              </SectionCard>
            )}

            {profile.role === "ADMIN" && (
              <SectionCard
                title="Account Information"
                description="Administrator account details"
                icon={<ShieldCheck size={20} />}
              >
                <InfoItem
                  label="Account Role"
                  value="Administrator"
                  icon={<ShieldCheck size={17} />}
                />

                <InfoItem
                  label="Account Status"
                  value={profile.status || "—"}
                  icon={<UserRound size={17} />}
                />
              </SectionCard>
            )}
          </div>
        )}

        {/* Add missing student information */}
        {addingField && profile.role === "STUDENT" && (
          <div className="mt-5 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm dark:border-blue-500/20 dark:bg-slate-900/70 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Add{" "}
                  {addingField === "classRoll"
                    ? "Class Roll"
                    : "Parent Phone"}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter the missing information below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAddingField(null)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/10"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddField}>
              <label
                htmlFor="addValue"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                {addingField === "classRoll"
                  ? "Class Roll"
                  : "Parent Phone Number"}
              </label>

              <input
                id="addValue"
                autoFocus
                required
                type={addingField === "parentPhone" ? "tel" : "text"}
                value={form[addingField]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [addingField]: e.target.value,
                  })
                }
                placeholder={
                  addingField === "classRoll"
                    ? "Enter your class roll"
                    : "Enter parent phone number"
                }
                className={inputClass}
              />

              <div className="mt-5 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddingField(null)}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  <Plus size={16} />
                  {saving ? "Adding..." : "Add Information"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <p className="mt-7 text-center text-xs text-slate-400">
          Your profile information is managed by the school administration.
        </p>
      </div>
    </main>
  );
}
