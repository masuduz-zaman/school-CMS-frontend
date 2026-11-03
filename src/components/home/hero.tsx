import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[720px] items-center overflow-hidden bg-slate-950">

      {/* Background Image */}
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=85&w=2000&auto=format&fit=crop')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/35" />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />

      {/* Decorative glow */}
      <div className="glow-blue absolute -left-40 top-20 h-96 w-96 rounded-full" />

      {/* Content */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-16 pt-36 lg:grid-cols-2 lg:px-8">

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur-xl">
            <GraduationCap size={17} />
            Welcome to Our Institution
          </div>

          <h1 className="mt-8 max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-7xl">
            Discover Your
            <span className="block bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Potential.
            </span>
            Shape Your Future.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            We believe every student has the potential to achieve
            greatness. Explore a learning environment that inspires
            curiosity, creativity and excellence.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="#about"
              className="group flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Explore Our School

              <ArrowRight
                size={19}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="#notices"
              className="glass-button flex items-center gap-2 rounded-xl px-6 py-4 font-semibold text-white"
            >
              <BookOpen size={18} />
              Latest Notices
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4 border-t border-white/15 pt-7">
            <div className="flex -space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-blue-500 text-white">
                <GraduationCap size={18} />
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-indigo-500 text-white">
                <BookOpen size={18} />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Learning Beyond Limits
              </p>

              <p className="text-xs text-slate-400">
                Inspiring the next generation
              </p>
            </div>
          </div>
        </div>

        {/* Glass Visual Card */}
        <div className="hidden justify-end lg:flex">
          <div className="glass w-full max-w-sm rounded-3xl p-7 shadow-2xl shadow-black/20">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
              <GraduationCap size={30} />
            </div>

            <p className="mt-7 text-sm font-semibold uppercase tracking-widest text-blue-300">
              Our Philosophy
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-snug text-white">
              Learn Today.
              <span className="block text-blue-300">
                Lead Tomorrow.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Education is not just about knowledge. It is about
              building character, confidence and possibilities.
            </p>

            <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}