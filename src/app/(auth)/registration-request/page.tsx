
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  BookOpen,
  ArrowLeft,
  Loader2,
  ClipboardList,
} from "lucide-react";

import { apiRequest } from "@/lib/api";

type RequestType = "STUDENT" | "TEACHER";

interface SchoolClass {
  id: string;
  name: string;
}

export default function AdmissionPage() {
  const router = useRouter();

  const [requestType, setRequestType] = useState<RequestType>("STUDENT");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Student fields
  const [classId, setClassId] = useState("");
  const [classRoll, setClassRoll] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load available classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);

        const response = await apiRequest<any>("/api/admin/all-class", {
          method: "GET",
        });

        const result =
          response?.data?.classes ??
          response?.data ??
          response?.classes ??
          response?.result ??
          [];

        if (Array.isArray(result)) {
          setClasses(result);
        }
      } catch (err) {
        console.error("Class loading error:", err);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (requestType === "STUDENT" && !classId) {
      setError("Please select your class.");
      return;
    }

    const payload = {
      name,
      email,
      phone: phone || undefined,
      password,
      requestType,

      ...(requestType === "STUDENT"
        ? {
            classId,
            classRoll: classRoll || undefined,
            parentPhone,
          }
        : {}),
    };

    try {
      setLoading(true);

      await apiRequest("/api/auth/registration", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Request submitted successfully
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration request failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-12 dark:bg-[#080e1b]">
      {/* Background effects */}
      <div className="glow-blue absolute -left-40 top-0 h-96 w-96 rounded-full" />
      <div className="glow-blue absolute -bottom-40 -right-20 h-96 w-96 rounded-full" />

      <div className="relative z-10 mx-auto max-w-3xl">

        {/* Back to Home */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <ArrowLeft size={17} />
          Back to Homepage
        </Link>

        {/* Form Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-2xl shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/80">

          {/* Header */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-950 px-6 py-10 text-center sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <GraduationCap size={34} />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold text-white">
              Registration Request
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-blue-100">
              Submit your information to request admission or teacher
              registration at our institution.
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-10">

            {/* Request Type */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-bold text-slate-800 dark:text-slate-200">
                Select Registration Type
              </label>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setRequestType("STUDENT");
                    setError("");
                  }}
                  className={`flex items-center justify-center gap-3 rounded-xl border p-4 font-semibold transition ${
                    requestType === "STUDENT"
                      ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "border-slate-200 text-slate-500 hover:border-blue-300 dark:border-white/10 dark:text-slate-400"
                  }`}
                >
                  <GraduationCap size={21} />
                  Student
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRequestType("TEACHER");
                    setError("");
                  }}
                  className={`flex items-center justify-center gap-3 rounded-xl border p-4 font-semibold transition ${
                    requestType === "TEACHER"
                      ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "border-slate-200 text-slate-500 hover:border-blue-300 dark:border-white/10 dark:text-slate-400"
                  }`}
                >
                  <UserRound size={21} />
                  Teacher
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Personal Information */}
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <UserRound size={20} className="text-blue-600" />
                  Personal Information
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email Address *
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Information */}
              {requestType === "STUDENT" && (
                <div className="border-t border-slate-200 pt-6 dark:border-white/10">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                    <BookOpen size={20} className="text-blue-600" />
                    Student Information
                  </h2>

                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* Class */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Select Class *
                      </label>

                      <select
                        required
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        disabled={loadingClasses}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="">
                          {loadingClasses
                            ? "Loading classes..."
                            : "Choose your class"}
                        </option>

                        {classes.map((schoolClass) => (
                          <option
                            key={schoolClass.id}
                            value={schoolClass.id}
                          >
                            {schoolClass.name}
                          </option>
                        ))}
                      </select>

                      {!loadingClasses && classes.length === 0 && (
                        <p className="mt-2 text-xs text-amber-600">
                          No classes available. Please contact the school.
                        </p>
                      )}
                    </div>

                    {/* Class Roll */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Class Roll
                      </label>

                      <div className="relative">
                        <ClipboardList
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          value={classRoll}
                          onChange={(e) => setClassRoll(e.target.value)}
                          placeholder="Enter class roll"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Parent Phone */}
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Parent / Guardian Phone *
                      </label>

                      <div className="relative">
                        <Phone
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="tel"
                          required
                          value={parentPhone}
                          onChange={(e) => setParentPhone(e.target.value)}
                          placeholder="Enter parent or guardian phone"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="border-t border-slate-200 pt-6 dark:border-white/10">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <LockKeyhole size={20} className="text-blue-600" />
                  Account Security
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Password *
                    </label>

                    <input
                      type="password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Confirm Password *
                    </label>

                    <input
                      type="password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || (requestType === "STUDENT" && loadingClasses)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  "Submit Registration Request"
                )}
              </button>

              <p className="text-center text-xs leading-6 text-slate-400">
                Your registration request will be reviewed by the school
                administration. Account access will be available after approval.
              </p>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
