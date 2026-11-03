import Link from "next/link";
import { GraduationCap, ArrowUp, Mail, MapPin } from "lucide-react";

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "#about" },
  { name: "Notices", href: "#notices" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
];

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-[#080e1b]">
      <div className="glow-blue absolute -bottom-40 -right-40 h-96 w-96 rounded-full" />

      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <GraduationCap size={27} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  School Name
                </h2>

                <p className="text-xs tracking-widest text-blue-600 dark:text-blue-400">
                  QUALITY EDUCATION
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-600 dark:text-slate-400">
              Inspiring students through quality education, creativity and
              lifelong learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Information
            </h3>

            <ul className="mt-5 space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <GraduationCap
                  size={18}
                  className="shrink-0 text-blue-600 dark:text-blue-400"
                />
                <span>Academic Information</span>
              </li>

              <li className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="shrink-0 text-blue-600 dark:text-blue-400"
                />
                <span>Admission Enquiries</span>
              </li>

              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="shrink-0 text-blue-600 dark:text-blue-400"
                />
                <span>School Information</span>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Account
            </h3>

            <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Access your school account to view your relevant information and
              activities.
            </p>

            <Link
              href="/login"
              className="mt-5 inline-flex rounded-xl border border-blue-500/20 bg-blue-600/90 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Login to Account
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-slate-200 pt-7 dark:border-white/10 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} School Name. All rights reserved.
          </p>

          <Link
            href="#top"
            aria-label="Back to top"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/60 text-slate-700 backdrop-blur-xl transition hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <ArrowUp size={19} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
