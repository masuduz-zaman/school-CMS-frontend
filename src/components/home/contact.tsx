import { MessageCircle } from "lucide-react";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-white py-20 dark:bg-[#0b1220]"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="glass overflow-hidden rounded-3xl p-8 text-center sm:p-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <MessageCircle size={27} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Get in Touch
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            We Are Here to Help
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-400">
            For admission enquiries and other school-related
            information, please contact the school administration.
          </p>
        </div>
      </div>
    </section>
  );
}