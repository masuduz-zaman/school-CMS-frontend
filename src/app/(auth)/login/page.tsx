"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  GraduationCap,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { loginUser, getCurrentUser } from "@/lib/auth";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    try {
      setLoading(true);
      setError("");

      await loginUser({ email, password });

      const response = (await getCurrentUser()) as any;
      const currentUser =
        response?.data?.user ?? response?.data ?? response?.user ?? null;

      router.replace(currentUser?.role === "ADMIN" ? "/admin" : "/profile");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 py-12 dark:bg-[#080e1b]">
      <div className="glow-blue absolute -left-40 top-0 h-96 w-96 rounded-full" />
      <div className="glow-blue absolute -bottom-40 -right-20 h-96 w-96 rounded-full" />

      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-2xl shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/70 lg:grid-cols-2">
        {/* Left Side */}
        <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-slate-950 p-12 lg:flex">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=85&w=1200&auto=format&fit=crop')",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-slate-950/80 to-slate-950/90" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <GraduationCap size={28} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">School Name</h2>

                <p className="text-xs tracking-widest text-blue-300">
                  SCHOOL MANAGEMENT SYSTEM
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-200 backdrop-blur-xl">
              Administration Portal
            </span>

            <h1 className="mt-7 text-5xl font-extrabold leading-tight text-white">
              Manage Your
              <span className="block text-blue-400">School Smarter.</span>
            </h1>

            <p className="mt-6 max-w-md leading-8 text-slate-300">
              A centralized platform to manage students, teachers, classes,
              notices and school activities.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 border-t border-white/15 pt-6">
            <ShieldCheck className="text-blue-300" size={22} />

            <p className="text-sm text-slate-300">
              School Administration Portal
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex items-center justify-center p-7 sm:p-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              <ArrowLeft size={17} />
              Back to Homepage
            </Link>

            <div className="mt-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <LockKeyhole size={27} />
              </div>

              <h1 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
                Welcome Back
              </h1>

              <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
                Sign in to access your school administration portal.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-9 space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="mt-7 text-center text-xs leading-6 text-slate-400">
              Secure access to your school administration portal.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
