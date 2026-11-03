import Link from "next/link";
import {
  GraduationCap,
  Users,
  School,
  ClipboardList,
  ArrowUpRight,
  Megaphone,
  Images,
  FileText,
  Plus,
} from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "—",
    description: "Registered students",
    icon: GraduationCap,
    color: "blue",
  },
  {
    title: "Total Teachers",
    value: "—",
    description: "Active teachers",
    icon: Users,
    color: "violet",
  },
  {
    title: "Total Classes",
    value: "—",
    description: "Available classes",
    icon: School,
    color: "cyan",
  },
  {
    title: "Admission Requests",
    value: "—",
    description: "Pending applications",
    icon: ClipboardList,
    color: "amber",
  },
];

const quickActions = [
  {
    title: "Manage Admission Requests",
    description: "Review and process applications",
    href: "/admin/requests",
    icon: ClipboardList,
  },
  {
    title: "Manage Students",
    description: "View and manage student accounts",
    href: "/admin/students",
    icon: GraduationCap,
  },
  {
    title: "Manage Teachers",
    description: "Manage teacher information",
    href: "/admin/teachers",
    icon: Users,
  },
  {
    title: "Manage Classes",
    description: "Create and manage classes",
    href: "/admin/classes",
    icon: School,
  },
];

const contentActions = [
  {
    title: "Publish Notice",
    href: "/admin/notices",
    icon: Megaphone,
  },
  {
    title: "Manage Gallery",
    href: "/admin/gallery",
    icon: Images,
  },
  {
    title: "Update School Message",
    href: "/admin/content",
    icon: FileText,
  },
];

const colorStyles: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">

      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-7 shadow-xl shadow-blue-900/10 sm:p-10">
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 right-40 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-7 md:flex-row md:items-center">
          <div>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest text-blue-100 backdrop-blur-xl">
              ADMIN CONTROL CENTER
            </span>

            <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
              Welcome to Dashboard
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-blue-100/80 sm:text-base">
              Manage your school, monitor activities and keep
              everything organized from one place.
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-white backdrop-blur-xl">
            <GraduationCap size={42} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            School Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Summary of your school information
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="glass glass-card rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorStyles[stat.color]}`}>
                    <Icon size={24} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-slate-400"
                  />
                </div>

                <p className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stat.value}
                </p>

                <h3 className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {stat.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Management */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            School Management
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quickly access your management sections
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="glass glass-card group rounded-2xl p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:text-blue-400">
                  <Icon size={23} />
                </div>

                <h3 className="mt-5 font-bold text-slate-900 dark:text-white">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {action.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Open Section
                  <ArrowUpRight size={17} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Content Management */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Website Content
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Control the information displayed on your school website
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {contentActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="glass glass-card flex items-center justify-between gap-4 rounded-2xl p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Icon size={22} />
                  </div>

                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {action.title}
                  </span>
                </div>

                <Plus
                  size={19}
                  className="shrink-0 text-slate-400"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Preview Notice */}
      <section className="glass rounded-2xl border-l-4 border-l-blue-500 p-5">
        <h3 className="font-bold text-slate-900 dark:text-white">
          Frontend Preview Mode
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
          Dashboard interface is ready for preview. Live statistics,
          student records, teacher records and admission requests
          will appear after backend integration.
        </p>
      </section>

    </div>
  );
}