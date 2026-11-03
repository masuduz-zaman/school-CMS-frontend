import Link from "next/link";
import {
  BookOpen,
  Lightbulb,
  Users,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Quality Education",
    description:
      "A learning environment focused on knowledge, understanding and academic growth.",
  },
  {
    icon: Lightbulb,
    title: "Creative Thinking",
    description:
      "Encouraging curiosity, creativity and independent thinking in every student.",
  },
  {
    icon: Users,
    title: "Student Development",
    description:
      "Supporting students as they develop confidence, discipline and responsibility.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white py-24 dark:bg-[#0b1220]"
    >
      <div className="glow-blue absolute -left-40 top-10 h-96 w-96 rounded-full" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              About Our Institution
            </p>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-5xl">
              More Than Education.
              <span className="mt-2 block text-blue-600 dark:text-blue-400">
                A Foundation for Life.
              </span>
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-slate-600 dark:text-slate-400">
              We believe education is the foundation of a better
              future. Our goal is to create an inspiring learning
              environment where students can discover their
              strengths, develop their abilities and prepare
              themselves for tomorrow.
            </p>

            <Link
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Get in Touch
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={`glass glass-card rounded-2xl p-6 ${
                    index === 0 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}