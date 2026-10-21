"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  ChevronsUpDown,
  CircleHelp,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Truck,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Avatar, BrandMark } from "@/components/ui";
import { TODAY_LABEL, manager, org } from "@/lib/data";

type NavItem = { label: string; href: string; icon: LucideIcon; count?: number; match?: (p: string) => boolean };

const nav: NavItem[] = [
  { label: "Overview", href: "/manager", icon: LayoutDashboard, match: (p) => p === "/manager" },
  { label: "Jobs & dispatch", href: "/manager/jobs", icon: CalendarDays, count: 12, match: (p) => p.startsWith("/manager/jobs") },
  { label: "Customers", href: "#", icon: UsersRound },
  { label: "Crews", href: "#", icon: Users },
  { label: "Fleet", href: "#", icon: Truck },
  { label: "Estimates", href: "#", icon: FileText },
  { label: "Payments", href: "#", icon: CreditCard },
  { label: "Reports", href: "#", icon: ChartNoAxesCombined },
];

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[216px] shrink-0 flex-col gap-7 overflow-y-auto border-r border-line bg-white px-4 pt-7 pb-5 lg:flex">
      <Link href="/manager" className="flex items-center gap-[9px] pl-2">
        <BrandMark />
        <span className="text-[21px] text-ink">movebase</span>
      </Link>

      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-lg border border-line bg-panel-alt p-2.5 text-left hover:bg-canvas"
      >
        <Avatar label={org.initials} tone="neutral" />
        <span className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="truncate text-xs text-ink">{org.name}</span>
          <span className="text-[10px] text-muted">{org.city}</span>
        </span>
        <ChevronsUpDown size={12} className="text-muted" />
      </button>

      <nav className="flex w-full flex-col gap-[5px]">
        <p className="text-[10px] font-semibold text-subtle">WORKSPACE</p>
        {nav.map((item) => {
          const active = item.match?.(pathname) ?? false;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex h-[41px] w-full items-center gap-[11px] rounded-lg px-3 ${
                active ? "bg-brand-soft" : "hover:bg-canvas"
              }`}
            >
              <Icon size={18} strokeWidth={1.75} className={active ? "text-brand" : "text-muted"} />
              <span className={`text-[13px] ${active ? "font-normal text-brand" : "font-medium text-muted"}`}>{item.label}</span>
              {item.count !== undefined && (
                <span className={`text-[10px] ${active ? "text-brand" : "text-subtle"}`}>{item.count}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="min-h-[40px] flex-1" />

      <div className="flex flex-col gap-4 p-3">
        <a href="#" className="flex items-start gap-2.5 text-[13px] text-muted hover:text-ink">
          <CircleHelp size={18} strokeWidth={1.75} />
          Help &amp; resources
        </a>
        <a href="#" className="flex items-start gap-2.5 text-[13px] text-muted hover:text-ink">
          <Settings size={18} strokeWidth={1.75} />
          Settings
        </a>
      </div>
      <div className="h-px w-full shrink-0 bg-line" />
      <div className="flex items-center gap-2.5">
        <Avatar label={manager.initials} size={36} textSize="text-sm" />
        <span className="flex flex-col">
          <span className="text-xs text-ink">{manager.name}</span>
          <span className="text-[11px] text-muted">{manager.role}</span>
        </span>
        <Link href="/" aria-label="Log out" className="text-muted hover:text-ink">
          <LogOut size={16} strokeWidth={1.75} />
        </Link>
      </div>
    </aside>
  );
}

function Topbar({ pathname }: { pathname: string }) {
  const crumb = pathname.startsWith("/manager/jobs") ? "Jobs & dispatch" : "Overview";
  return (
    <header className="flex h-[72px] w-full shrink-0 items-center justify-between gap-4 border-b border-line bg-white px-4 md:px-8">
      <div className="flex items-center gap-2.5 text-xs">
        <Link href="/manager" className="flex items-center gap-2 lg:hidden">
          <BrandMark size={26} />
        </Link>
        <span className="hidden text-muted sm:inline">Workspace</span>
        <ChevronRight size={12} className="hidden text-muted sm:inline" />
        <span className="text-ink">{crumb}</span>
      </div>
      <div className="flex items-center gap-5">
        <label className="hidden h-[34px] w-[244px] items-center gap-[9px] rounded-lg bg-canvas px-2.5 md:flex">
          <Search size={15} className="text-subtle" />
          <input
            placeholder="Search jobs, customers..."
            className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-subtle"
          />
          <span className="text-[10px] text-subtle">{"⌘"} K</span>
        </label>
        <span className="hidden text-xs text-muted xl:inline">{TODAY_LABEL}</span>
        <button type="button" aria-label="Notifications" className="text-muted hover:text-ink">
          <Bell size={18} strokeWidth={1.75} />
        </button>
        <Avatar label={manager.initials} />
      </div>
    </header>
  );
}

export function ManagerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen w-full items-start bg-canvas">
      <Sidebar pathname={pathname} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar pathname={pathname} />
        <main className="flex w-full flex-col gap-6 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-[5px]">
        {eyebrow && <p className="text-xs font-semibold text-brand">{eyebrow}</p>}
        <h1 className="text-[28px] font-bold text-ink">{title}</h1>
        <p className="text-[13px] text-muted">{subtitle}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
