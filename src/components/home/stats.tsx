import {
  GraduationCap,
  Users,
  School,
} from "lucide-react";

import { SchoolStats } from "@/types/content";

interface StatsSectionProps {
  stats?: SchoolStats | null;
}

export default function StatsSection({
  stats,
}: StatsSectionProps) {
  if (!stats) return null;

  const items = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: GraduationCap,
    },
    {
      label: "Total Teachers",
      value: stats.totalTeachers,
      icon: Users,
    },
    {
      label: "Total Classes",
      value: stats.totalClasses,
      icon: School,
    },
  ];

  return (
    <section className="relative bg-slate-50 py-16 dark:bg-[#080e1b]">
      <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-3 lg:px-8">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="glass glass-card rounded-2xl p-7 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Icon size={27} />
              </div>

              <p className="mt-5 text-3xl font-extrabold text-slate-900 dark:text-white">
                {item.value.toLocaleString()}
              </p>

              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}