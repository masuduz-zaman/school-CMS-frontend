
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  LogOut,
  LayoutDashboard,
  UserRound,
  FilePlus,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import ThemeToggle from "@/components/ui/theme-toggle";
import { getCurrentUser } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  { name: "Notices", href: "#notices" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
];

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STUDENT" | "TEACHER";
}

interface RegistrationStatus {
  name: string;
  requestType: "STUDENT" | "TEACHER";
  status: "PENDING" | "APPROVED" | "CANCELLED" | "BLOCKED";
  reviewNote?: string | null;
  createdAt?: string;
}

const statusInfo = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-600",
    icon: Clock,
    message: "Your request is waiting for admin approval.",
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-500/10 text-green-600",
    icon: CheckCircle,
    message: "Your registration request has been approved.",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-600",
    icon: XCircle,
    message: "Your registration request was cancelled.",
  },
  BLOCKED: {
    label: "Blocked",
    color: "bg-red-500/10 text-red-600",
    icon: Ban,
    message: "Your registration request has been blocked.",
  },
};

export default function SiteHeader() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [request, setRequest] =
    useState<RegistrationStatus | null>(null);

  const [checkingRequest, setCheckingRequest] = useState(false);

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check logged-in user
  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        const response = await getCurrentUser();
        const result = response as any;

        const currentUser =
          result?.data?.user ??
          result?.data ??
          result?.user ??
          null;

        if (mounted && currentUser?.role) {
          setUser(currentUser as AuthUser);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    checkUser();

    return () => {
      mounted = false;
    };
  }, []);

  // Load application status
  useEffect(() => {
    if (user) return;

    const token = localStorage.getItem(
      "registrationRequestToken"
    );

    if (!token) return;

    let mounted = true;

    const loadRequestStatus = async () => {
      try {
        setCheckingRequest(true);

        const response = await apiRequest(
          "/api/auth/registration-status",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = response as any;

        const requestData =
          result?.data?.request ??
          result?.data ??
          result?.request ??
          null;

        if (mounted && requestData?.status) {
          setRequest(requestData as RegistrationStatus);
        }
      } catch (error) {
        console.error("Request status error:", error);
      } finally {
        if (mounted) {
          setCheckingRequest(false);
        }
      }
    };

    loadRequestStatus();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Logout Handler
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await apiRequest("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
      setShowAccountMenu(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  // Only Admin can access Dashboard
  const accountLink =
    user?.role === "ADMIN" ? "/admin" : "/profile";

  const accountLabel =
    user?.role === "ADMIN" ? "Dashboard" : "My Profile";

  const StatusIcon = request
    ? statusInfo[request.status]?.icon ?? Clock
    : Clock;

  const status = request
    ? statusInfo[request.status]
    : null;

  // Account Dropdown
  const accountDropdown = (
    <div className="relative">

      <button
        type="button"
        onClick={() =>
          setShowAccountMenu((prev) => !prev)
        }
        aria-label="Account menu"
        aria-expanded={showAccountMenu}
        className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200
          ${
            showAccountMenu
              ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
              : "border-slate-300/60 bg-white/40 text-slate-700 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-600 dark:border-white/10 dark:bg-white/10 dark:text-white"
          }`}
      >
        <UserRound size={21} />

        {user && (
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-slate-900" />
        )}

        {!user && request && (
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-yellow-500 dark:border-slate-900" />
        )}
      </button>

      {showAccountMenu && (
        <>
          {/* Outside Click Overlay */}
          <button
            type="button"
            aria-label="Close account menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setShowAccountMenu(false)}
          />

          {/* Dropdown Content */}
          <div className="glass absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200/50 p-3 shadow-2xl dark:border-white/10">

            {checkingAuth ? (
              <div className="py-6 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Checking account...
                </p>
              </div>
            ) : user ? (
              /* Logged In User */
              <div className="space-y-2">

                {/* User Information */}
                <div className="mb-2 border-b border-slate-200 px-3 pb-3 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      <UserRound size={22} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>

                      <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Dashboard / User Profile */}
                <Link
                  href={accountLink}
                  onClick={() => setShowAccountMenu(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-500/10 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
                >
                  {user.role === "ADMIN" ? (
                    <LayoutDashboard size={19} />
                  ) : (
                    <UserRound size={19} />
                  )}

                  {accountLabel}
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-xl bg-red-500/10 px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:text-white"
                >
                  <LogOut size={19} />

                  {loggingOut
                    ? "Logging out..."
                    : "Logout"}
                </button>

              </div>
            ) : (
              /* Logged Out User */
              <div className="space-y-2">

                {checkingRequest ? (
                  <div className="py-5 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Checking application...
                    </p>
                  </div>
                ) : request ? (
                  /* Application Status */
                  <div className="space-y-3">

                    <div className="flex items-center justify-between border-b border-slate-200 px-2 pb-3 dark:border-white/10">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          My Application
                        </h3>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Registration Status
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${status?.color}`}
                      >
                        {status?.label}
                      </span>
                    </div>

                    <div className="space-y-1 px-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Applicant
                      </p>

                      <p className="text-sm font-semibold text-slate-800 dark:text-white">
                        {request.name}
                      </p>
                    </div>

                    <div className="space-y-1 px-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Request Type
                      </p>

                      <p className="text-sm font-semibold text-slate-800 dark:text-white">
                        {request.requestType}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/5">
                      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
                        <StatusIcon size={17} />
                        {status?.label}
                      </div>

                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {status?.message}
                      </p>
                    </div>

                    {request.reviewNote && (
                      <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          Admin Note
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {request.reviewNote}
                        </p>
                      </div>
                    )}

                    <p className="px-2 pb-1 text-center text-xs text-slate-500 dark:text-slate-400">
                      You have already submitted your application.
                    </p>

                  </div>
                ) : (
                  /* No Application Found */
                  <div className="space-y-2">

                    <Link
                      href="/login"
                      onClick={() => setShowAccountMenu(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-500/10 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
                    >
                      <UserRound size={19} />
                      Login
                    </Link>

                    <Link
                      href="/registration-request"
                      onClick={() => setShowAccountMenu(false)}
                      className="flex items-center gap-3 rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                      <FilePlus size={19} />
                      Apply Now
                    </Link>

                  </div>
                )}

              </div>
            )}

          </div>
        </>
      )}
    </div>
  );

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-3 pt-3 sm:px-5">

      <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 shadow-lg shadow-slate-900/5 sm:px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <GraduationCap size={25} />
          </div>

          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              School Name
            </h1>

            <p className="text-[10px] font-medium tracking-widest text-blue-700 dark:text-blue-400">
              QUALITY EDUCATION
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <ThemeToggle />

          {/* All Account Actions Under One Icon */}
          {accountDropdown}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 sm:hidden">

          <ThemeToggle />

          {/* Account Icon */}
          {accountDropdown}

          {/* Mobile Navigation Menu */}
          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setShowMobileMenu((prev) => !prev)
              }
              aria-label="Toggle navigation menu"
              aria-expanded={showMobileMenu}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300/60 bg-white/40 text-slate-800 transition hover:bg-blue-500/10 dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              {showMobileMenu ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>

            {showMobileMenu && (
              <>
                <button
                  type="button"
                  aria-label="Close navigation"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setShowMobileMenu(false)}
                />

                <nav className="glass absolute right-0 top-14 z-50 flex w-64 flex-col gap-1 rounded-2xl border border-slate-200/50 p-3 shadow-xl dark:border-white/10">

                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setShowMobileMenu(false)}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-500/10 dark:text-slate-200"
                    >
                      {link.name}
                    </Link>
                  ))}

                </nav>
              </>
            )}

          </div>
        </div>

      </div>
    </header>
  );
}
