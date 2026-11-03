import {
  ClipboardList,
  GraduationCap,
  Users,
  School,
  Megaphone,
  Images,
  FileText,
} from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: "requests" | "students" | "teachers" | "classes" | "notices" | "gallery" | "content";
}

const icons = {
  requests: ClipboardList,
  students: GraduationCap,
  teachers: Users,
  classes: School,
  notices: Megaphone,
  gallery: Images,
  content: FileText,
};

export default function AdminSectionPlaceholder({
  title,
  description,
  icon,
}: Props) {
  const Icon = icons[icon];

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          School Management
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
          {title}
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="glass flex min-h-[350px] flex-col items-center justify-center rounded-3xl px-6 py-14 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Icon size={32} />
        </div>

        <h2 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
          This management section is ready for frontend development.
          Records and management actions will be connected in the next
          development stage.
        </p>
      </div>
    </div>
  );
}