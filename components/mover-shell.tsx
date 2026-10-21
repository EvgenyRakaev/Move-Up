"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, Clock3, Ellipsis, MessageCircle, UserRound, type LucideIcon } from "lucide-react";
import { Avatar, BrandMark } from "@/components/ui";
import { org } from "@/lib/data";

const tabs: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Jobs", href: "/mover", icon: BriefcaseBusiness },
  { label: "Timesheet", href: "#", icon: Clock3 },
  { label: "Messages", href: "#", icon: MessageCircle },
  { label: "Profile", href: "#", icon: UserRound },
];

export function MoverShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen w-full justify-center bg-[#e9edf3]">
      <div className="relative flex min-h-screen w-full max-w-[430px] flex-col bg-canvas md:shadow-[0_0_0_1px_var(--color-line)]">
        {children}
        <nav className="sticky bottom-0 z-10 mt-auto flex items-start justify-between border-t border-line bg-white px-7 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          {tabs.map(({ label, href, icon: Icon }) => {
            const active = label === "Jobs" && pathname.startsWith("/mover");
            return (
              <Link key={label} href={href} className="flex flex-col items-center gap-[5px]">
                <Icon size={22} strokeWidth={1.75} className={active ? "text-brand" : "text-muted"} />
                <span className={`text-[10px] ${active ? "text-brand" : "font-medium text-muted"}`}>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function MoverHomeBar({ initials }: { initials: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-5">
      <div className="flex items-center gap-3">
        <BrandMark />
        <div className="flex flex-col">
          <span className="text-[21px] leading-tight font-bold text-ink">movebase</span>
          <span className="text-[11px] text-muted">{org.name}</span>
        </div>
      </div>
      <Avatar label={initials} size={34} />
    </header>
  );
}

export function MoverSubBar({ title, subtitle, backHref }: { title: string; subtitle: string; backHref?: string }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Back"
          onClick={() => (backHref ? router.push(backHref) : router.back())}
          className="text-ink"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex flex-col">
          <span className="text-[17px] leading-tight font-bold text-ink">{title}</span>
          <span className="text-[11px] text-muted">{subtitle}</span>
        </div>
      </div>
      <button type="button" aria-label="More" className="text-ink">
        <Ellipsis size={22} />
      </button>
    </header>
  );
}
