import Link from "next/link";
import { ArrowRight, LayoutDashboard, Smartphone } from "lucide-react";
import { BrandMark } from "@/components/ui";
import { org } from "@/lib/data";

const apps = [
  {
    href: "/manager",
    icon: LayoutDashboard,
    title: "Manager workspace",
    text: "Overview, jobs & dispatch, customer and job details.",
  },
  {
    href: "/mover",
    icon: Smartphone,
    title: "Crew app",
    text: "Today's jobs, move details and the job checklist for movers.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="flex w-full max-w-[520px] flex-col gap-6">
        <div className="flex items-center gap-3">
          <BrandMark size={36} />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-ink">movebase</span>
            <span className="text-xs text-muted">{org.name}</span>
          </div>
        </div>
        <p className="text-[13px] text-muted">Pick a workspace. Data is mocked for this first iteration.</p>
        <div className="flex flex-col gap-3">
          {apps.map(({ href, icon: Icon, title, text }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-xl border border-line bg-white p-5 transition-colors hover:border-brand-border"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <span className="flex flex-1 flex-col gap-1">
                <span className="text-[15px] font-semibold text-ink">{title}</span>
                <span className="text-xs text-muted">{text}</span>
              </span>
              <ArrowRight size={18} className="text-muted" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
