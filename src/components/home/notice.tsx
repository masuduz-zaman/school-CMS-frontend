import { Notice } from "@/types/notice";
import { CalendarDays, Megaphone } from "lucide-react";

interface NoticeSectionProps {
  notices: Notice[];
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

export default function NoticeSection({
  notices,
}: NoticeSectionProps) {
  return (
    <section
      id="notices"
      className="relative overflow-hidden bg-slate-50 py-24 dark:bg-[#080e1b]"
    >
      <div className="glow-blue absolute -right-40 top-10 h-96 w-96 rounded-full" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Stay Connected
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Latest Announcements
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-400">
              Stay informed with the latest news, announcements
              and important updates from our institution.
            </p>
          </div>

          <div className="glass flex w-fit items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Megaphone size={18} className="text-blue-600 dark:text-blue-400" />
            {notices.length} Published Notices
          </div>
        </div>

        {notices.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <article
                key={notice.id}
                className="glass glass-card rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                    IMPORTANT NOTICE
                  </span>

                  <CalendarDays
                    size={18}
                    className="text-slate-400"
                  />
                </div>

                <p className="mt-5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {formatDate(notice.publishedAt)}
                </p>

                <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                  {notice.title}
                </h3>

                <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {notice.content}
                </p>

                {notice.createdBy?.name && (
                  <div className="mt-6 border-t border-slate-200/70 pt-4 dark:border-white/10">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Published by
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {notice.createdBy.name}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl px-6 py-16 text-center">
            <Megaphone
              size={35}
              className="mx-auto text-blue-500"
            />

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              No Notices Available
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              New announcements will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}