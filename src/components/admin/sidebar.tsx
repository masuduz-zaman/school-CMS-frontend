"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  GraduationCap,
  Users,
  School,
  Megaphone,
  Images,
  FileText,
  Home,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const menuGroups = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        label: "Admission Requests",
        href: "/admin/requests",
        icon: ClipboardList,
      },
      {
        label: "Students",
        href: "/admin/students",
        icon: GraduationCap,
      },
      {
        label: "Teachers",
        href: "/admin/teachers",
        icon: Users,
      },
      {
        label: "Classes",
        href: "/admin/classes",
        icon: School,
      },
    ],
  },
  {
    title: "SCHOOL CONTENT",
    items: [
      {
        label: "Notices",
        href: "/admin/notices",
        icon: Megaphone,
      },
      {
        label: "Gallery",
        href: "/admin/gallery",
        icon: Images,
      },
      {
        label: "School Message",
        href: "/admin/content",
        icon: FileText,
      },
    ],
  },
];

export default function AdminSidebar({
  mobileOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/70 bg-white/95 backdrop-blur-2xl transition-transform dark:border-white/10 dark:bg-[#0b1220]/95 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-200/70 px-6 dark:border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <GraduationCap size={26} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                SchoolCMS
              </h2>
              <p className="text-[10px] font-semibold tracking-widest text-blue-600 dark:text-blue-400">
                ADMIN PANEL
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-slate-500 md:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-7">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                        active
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "text-slate-600 hover:bg-blue-500/10 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                      }`}
                    >
                      <Icon size={19} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200/70 p-4 dark:border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            <Home size={19} />
            Back to Website
          </Link>
        </div>
      </aside>
    </>
  );
}