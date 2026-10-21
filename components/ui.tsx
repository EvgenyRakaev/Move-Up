import Link from "next/link";
import { Truck, type LucideIcon } from "lucide-react";
import type { JobStatus } from "@/lib/data";

export type Tone = "brand" | "neutral" | "success" | "warn";

const toneClasses: Record<Tone, { bg: string; dot: string; text: string }> = {
  brand: { bg: "bg-brand-soft", dot: "bg-brand", text: "text-brand" },
  neutral: { bg: "bg-canvas", dot: "bg-muted", text: "text-muted" },
  success: { bg: "bg-success-soft", dot: "bg-success", text: "text-success" },
  warn: { bg: "bg-warn-soft", dot: "bg-warn", text: "text-warn" },
};

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const t = toneClasses[tone];
  return (
    <span className={`inline-flex w-fit shrink-0 items-center gap-[5px] rounded-md px-2 py-1 ${t.bg}`}>
      <span className={`size-[5px] rounded-[3px] ${t.dot}`} />
      <span className={`whitespace-nowrap text-[11px] font-semibold ${t.text}`}>{children}</span>
    </span>
  );
}

const statusMap: Record<JobStatus, { tone: Tone; label: string }> = {
  "in-progress": { tone: "brand", label: "In progress" },
  scheduled: { tone: "neutral", label: "Scheduled" },
  completed: { tone: "success", label: "Completed" },
  "needs-crew": { tone: "warn", label: "Needs crew" },
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const s = statusMap[status];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function Panel({
  title,
  action,
  className = "",
  padding = "p-5",
  children,
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  padding?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`flex w-full flex-col gap-4 rounded-xl border border-line bg-white ${padding} ${className}`}>
      {(title || action) && (
        <div className="flex w-full items-center justify-between gap-3">
          {title && <h2 className="text-base font-normal text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function TextLink({
  href = "#",
  children,
  size = "text-xs",
  className = "",
}: {
  href?: string;
  children: React.ReactNode;
  size?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`whitespace-nowrap font-semibold text-brand hover:underline ${size} ${className}`}>
      {children}
    </Link>
  );
}

type ButtonProps = {
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  href?: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

export function Button({ icon: Icon, variant = "secondary", size = "md", href, className = "", onClick, children }: ButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 rounded-lg border px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${
    size === "md" ? "h-10" : "h-[34px]"
  }`;
  const look =
    variant === "primary"
      ? "border-brand bg-brand text-white hover:bg-brand-deep hover:border-brand-deep"
      : "border-line bg-white text-ink hover:bg-panel-alt";
  const content = (
    <>
      {Icon && <Icon size={16} strokeWidth={2} className={variant === "primary" ? "text-white" : "text-ink"} />}
      {children}
    </>
  );
  const cls = `${base} ${look} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {content}
    </button>
  );
}

export function Avatar({
  label,
  size = 32,
  tone = "brand",
  textSize = "text-[11px]",
}: {
  label: string;
  size?: number;
  tone?: "brand" | "neutral";
  textSize?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${
        tone === "brand" ? "bg-brand-soft text-brand" : "bg-canvas text-muted"
      } ${textSize}`}
      style={{ width: size, height: size }}
    >
      {label}
    </span>
  );
}

export function Divider() {
  return <div className="h-px w-full shrink-0 bg-line" />;
}

export function DetailRow({ label, value, valueClass = "text-ink" }: { label: string; value: React.ReactNode; valueClass?: string }) {
  return (
    <div className="flex w-full items-center justify-between gap-3 text-[13px]">
      <span className="text-muted">{label}</span>
      <span className={`whitespace-nowrap ${valueClass}`}>{value}</span>
    </div>
  );
}

export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand" style={{ width: size, height: size }}>
      <Truck size={Math.round(size * 0.63)} strokeWidth={2} className="text-white" />
    </span>
  );
}
