import Link from "next/link";
import {
  Banknote,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  CircleCheck,
  MessageCircle,
  Plus,
  TriangleAlert,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PageHeading } from "@/components/manager-shell";
import { Avatar, Badge, Button, Panel, StatusBadge, TextLink } from "@/components/ui";
import { NOW_LABEL, TOTAL_JOBS_TODAY, crews, getCrew, jobs, manager, routeLabel, upcomingJobs } from "@/lib/data";

function Metric({
  label,
  icon: Icon,
  value,
  accent,
  context,
}: {
  label: string;
  icon: LucideIcon;
  value: string;
  accent: string;
  context: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 basis-[200px] flex-col gap-3 rounded-xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-muted">{label}</span>
        <Icon size={17} strokeWidth={1.75} className="text-muted" />
      </div>
      <p className="text-[30px] font-bold text-ink">{value}</p>
      <div className="flex gap-[7px] text-[11px] whitespace-nowrap">
        <span className="font-semibold text-success">{accent}</span>
        <span className="text-muted">{context}</span>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const unassigned = jobs.find((j) => j.status === "needs-crew");
  const counts = {
    progress: jobs.filter((j) => j.status === "in-progress").length,
    scheduled: 5,
    completed: 1,
  };

  return (
    <>
      <PageHeading
        title={`Good morning, ${manager.first}`}
        subtitle="Here's what's moving today. Keep every crew one step ahead."
        actions={
          <>
            <Button icon={CalendarDays}>Today, Oct 4</Button>
            <Button icon={Plus} variant="primary">
              New job
            </Button>
          </>
        }
      />

      <div className="flex w-full flex-wrap gap-4">
        <Metric label="Today's moves" icon={Truck} value={String(TOTAL_JOBS_TODAY)} accent="6 crews ready" context="2 need attention" />
        <Metric label="Revenue this month" icon={Banknote} value="$48,250" accent={"↗ 12.8%"} context="vs. last month" />
        <Metric label="Open pipeline" icon={ChartNoAxesCombined} value="$32,400" accent="18 estimates" context="awaiting a decision" />
        <Metric label="Crew utilization" icon={Users} value="86%" accent={"↗ 6%"} context="vs. last week" />
      </div>

      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-5">
          <Panel title="Today's moves" action={<TextLink href="/manager/jobs">Open dispatch {"→"}</TextLink>}>
            <div className="flex flex-wrap gap-2">
              <Badge tone="brand">{counts.progress} in progress</Badge>
              <Badge tone="neutral">{counts.scheduled} scheduled</Badge>
              <Badge tone="success">{counts.completed} completed</Badge>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[520px]">
                <div className="flex gap-3 bg-panel-alt py-[9px] text-[10px] font-semibold text-muted">
                  <span className="flex-1">CUSTOMER / ROUTE</span>
                  <span className="w-[66px] shrink-0">START</span>
                  <span className="w-[75px] shrink-0">CREW / TRUCK</span>
                  <span className="w-[129px] shrink-0">STATUS</span>
                </div>
                {jobs.map((job) => {
                  const crew = getCrew(job.crewId);
                  return (
                    <Link
                      key={job.id}
                      href={`/manager/jobs/${job.id}`}
                      className="flex h-[72px] items-center gap-3 border-b border-line hover:bg-panel-alt"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                        <div className="flex items-baseline gap-[7px]">
                          <span className="truncate text-[13px] font-semibold text-ink">{job.customer}</span>
                          <span className="text-[10px] text-subtle">{job.id}</span>
                        </div>
                        <span className="truncate text-[11px] text-muted">{routeLabel(job)}</span>
                      </div>
                      <span className="w-[66px] shrink-0 text-xs text-ink">{job.start}</span>
                      <div className="flex w-[75px] shrink-0 flex-col gap-[3px]">
                        <span className={`text-xs ${crew ? "text-ink" : "text-warn"}`}>{crew ? crew.name.replace(" crew", "") : "Unassigned"}</span>
                        <span className="text-[11px] text-muted">{crew ? crew.truck : "—"}</span>
                      </div>
                      <div className="w-[103px] shrink-0">
                        <StatusBadge status={job.status} />
                      </div>
                      <ChevronRight size={14} className="shrink-0 text-muted" />
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted">
                Showing {jobs.length} of {TOTAL_JOBS_TODAY} moves
              </span>
              <TextLink href="/manager/jobs">View all moves</TextLink>
            </div>
          </Panel>

          <Panel title="Upcoming jobs" action={<TextLink href="/manager/jobs">View calendar {"→"}</TextLink>}>
            {upcomingJobs.map((u) => (
              <div key={u.customer} className="flex items-center gap-3">
                <div className="flex h-[46px] w-10 shrink-0 flex-col items-center justify-center rounded-md bg-canvas">
                  <span className="text-[9px] font-semibold text-muted">{u.day}</span>
                  <span className="text-[17px] text-ink">{u.date}</span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[13px] font-semibold text-ink">{u.customer}</span>
                  <span className="truncate text-[11px] text-muted">{u.summary}</span>
                </div>
                <span className="hidden text-[11px] text-muted sm:inline">{u.time}</span>
                {u.status === "confirmed" ? <Badge tone="success">Confirmed</Badge> : <Badge tone="warn">Deposit due</Badge>}
              </div>
            ))}
          </Panel>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-5 xl:w-[320px]">
          <Panel title="Crew assignments" action={<TextLink>All crews</TextLink>}>
            {crews.map((crew) => {
              const job = jobs.find((j) => j.crewId === crew.id && j.status === "in-progress") ?? jobs.find((j) => j.crewId === crew.id);
              return (
                <div key={crew.id} className="flex flex-col gap-[9px] border-b border-line pb-3">
                  <div className="flex items-center gap-[9px]">
                    <Avatar label={crew.letter} />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-[13px] font-semibold text-ink">{crew.name}</span>
                      <span className="truncate text-[10px] text-muted">{crew.members.map((m) => m.name.split(" ")[0]).join(", ")}</span>
                    </div>
                    <button type="button" aria-label={`Message ${crew.name}`} className="text-brand">
                      <MessageCircle size={16} strokeWidth={1.75} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted">
                      {crew.truck} {"•"} {job?.id}
                    </span>
                    {job && <StatusBadge status={job.status} />}
                  </div>
                </div>
              );
            })}
          </Panel>

          <Panel title="Needs attention">
            {unassigned && (
              <div className="flex flex-col gap-[7px] rounded-lg bg-warn-soft p-3 text-warn">
                <div className="flex items-start gap-2">
                  <TriangleAlert size={16} strokeWidth={1.75} />
                  <span className="text-xs">Crew needed for {unassigned.start}</span>
                </div>
                <p className="text-[11px]">
                  {unassigned.customer} {"·"} {unassigned.id} is still unassigned.
                </p>
                <Link href="/manager/jobs" className="text-[11px] hover:underline">
                  Assign crew {"→"}
                </Link>
              </div>
            )}
            <div className="flex flex-col gap-[5px]">
              <p className="text-xs font-semibold text-ink">3 deposits overdue</p>
              <p className="text-[11px] text-muted">$1,650 outstanding on upcoming jobs.</p>
              <TextLink size="text-[11px]">Review payments {"→"}</TextLink>
            </div>
          </Panel>

          <Panel title="Estimate pipeline">
            <div className="flex items-start justify-between">
              <span className="text-[23px] font-bold text-ink">$32,400</span>
              <span className="text-[11px] text-muted">18 open</span>
            </div>
            <div className="flex gap-[3px]">
              <div className="h-2 flex-[76] rounded-[3px] bg-brand-soft" />
              <div className="h-2 flex-[110] rounded-[3px] bg-brand-light" />
              <div className="h-2 flex-[86] rounded-[3px] bg-brand" />
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-muted">New 5</span>
              <span className="text-muted">Sent 8</span>
              <span className="text-brand">Follow-up 5</span>
            </div>
          </Panel>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-subtle">
        <CircleCheck size={12} className="text-success" />
        All operations synced {"·"} Last updated at {NOW_LABEL}
      </div>
    </>
  );
}
