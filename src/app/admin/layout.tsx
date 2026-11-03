"use client";

import { useEffect, useState } from "react";

import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/header";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      try {
        await getCurrentUser();

        if (active) {
          setAuthChecking(false);
        }
      } catch {
        if (active) {
          router.replace("/login");
        }
      }
    };

    checkAuth();

    return () => {
      active = false;
    };
  }, [router]);

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">
          Checking authentication...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080e1b]">

      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen md:pl-72">
        <AdminHeader
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="mx-auto max-w-[1600px] p-4 sm:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}