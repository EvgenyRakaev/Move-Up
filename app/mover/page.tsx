import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, CloudCheck, MapPin, MessageSquare, Package, Truck, Users } from "lucide-react";
import { MoverHomeBar } from "@/components/mover-shell";
import { Avatar, Button, StatusBadge } from "@/components/ui";
import { NOW_LABEL, crews, firstName, jobs, routeLabel, type Job } from "@/lib/data";

const crew = crews[0]; // signed-in mover belongs to Alpha crew
const me = crew.members[0];

function CurrentJob({ job }: { job: Job }) {
  return (
    <article className="flex w-full flex-col gap-3.5 rounded-xl border-[1.5px] border-brand bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink">
          {job.start} {"–"} {job.end}
        </span>
        <StatusBadge status={job.status} />
      </div>
      <div className="flex flex-col gap-[3px]">
        <h3 className="text-lg font-bold text-ink">{job.customer}</h3>
        <p className="text-[11px] text-muted">
          {job.id} {"·"} {job.size}
        </p>
      </div>
      <div className="h-px w-full bg-line" />
      <div className="flex flex-col gap-3">
        <Stop marker="round" label="Pickup" address={`${job.pickup.line1.split(",")[0]}, Austin`} />
        <Stop marker="square" label="Delivery" address={`${job.delivery.line1}, Austin`} />
      </div>
      <div className="flex gap-4 text-[11px] text-muted">
        <span className="flex items-center gap-[5px]">
          <Package size={14} strokeWidth={1.75} />
          {job.items} items
        </span>
        <span className="flex items-center gap-[5px]">
          <Truck size={14} strokeWidth={1.75} />
          {job.volume} cu ft
        </span>
      </div>
      {job.startedAt && (
        <div className="flex items-start gap-2 rounded-md bg-brand-soft p-2.5 text-[11px] font-medium text-brand">
          <Clock3 size={15} strokeWidth={1.75} />
          Loading underway {"·"} Started at {job.startedAt}
        </div>
      )}
      <Button href={`/mover/jobs/${job.id}`} icon={ArrowRight} variant="primary" className="w-full">
        View job
      </Button>
    </article>
  );
}

function Stop({ marker, label, address }: { marker: "round" | "square"; label: string; address: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`size-[7px] shrink-0 ${marker === "round" ? "rounded-full bg-brand" : "rounded-[1px] bg-muted"}`} />
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-muted">{label}</span>
        <span className="text-xs font-medium text-ink">{address}</span>
      </div>
    </div>
  );
}

function NextJob({ job }: { job: Job }) {
  return (
    <Link href={`/mover/jobs/${job.id}`} className="flex w-full flex-col gap-4 rounded-xl border border-line bg-white p-4 hover:border-brand-border">
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink">
          {job.start} {"–"} {job.end}
        </span>
        <StatusBadge status={job.status} />
      </div>
      <div className="flex flex-col gap-[3px]">
        <h3 className="text-lg font-bold text-ink">{job.customer}</h3>
        <p className="text-[11px] text-muted">
          {job.id} {"·"} {job.size}
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted">
        <MapPin size={15} strokeWidth={1.75} />
        {routeLabel(job)}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted">
          {job.items} items {"·"} {job.volume} cu ft
        </span>
        <span className="text-xs font-semibold text-brand">View details {"→"}</span>
      </div>
    </Link>
  );
}

export default function MoverTodayPage() {
  const myJobs = jobs.filter((j) => j.crewId === crew.id).sort((a, b) => a.startH - b.startH);
  const current = myJobs.find((j) => j.status === "in-progress");
  const rest = myJobs.filter((j) => j !== current);
  const hours = myJobs.reduce((s, j) => s + (j.endH - j.startH), 0);
  const others = crew.members.slice(1);

  return (
    <>
      <MoverHomeBar initials={me.initials} />
      <div className="flex flex-col gap-5 px-5 py-6">
        <div className="flex flex-col gap-[5px]">
          <h1 className="text-[25px] font-bold text-ink">Morning, {firstName(me.name)} {"\u{1F44B}"}</h1>
          <p className="text-[13px] text-muted">Sunday, October 4 {"·"} Let&apos;s get moving.</p>
        </div>

        <section className="flex flex-col gap-4 rounded-xl bg-navy p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-white">
              <Users size={18} strokeWidth={1.75} className="text-[#a9c6ff]" />
              {crew.name}
            </span>
            <span className="text-[11px] text-[#a9c6ff]">
              {crew.truck} {"·"} {crew.truckDesc}
            </span>
          </div>
          <div className="flex justify-between">
            {[
              { v: String(myJobs.length), l: "Assigned jobs" },
              { v: `${hours} h`, l: "Est. move time" },
              { v: String(crew.members.length), l: "Crew members" },
            ].map((s) => (
              <div key={s.l} className="flex flex-col gap-[3px]">
                <span className="text-[23px] font-bold text-white">{s.v}</span>
                <span className="text-[10px] text-[#b9c8dc]">{s.l}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between">
          <h2 className="text-lg text-ink">Today&apos;s jobs</h2>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Previous day" className="text-muted">
              <ChevronLeft size={15} />
            </button>
            <span className="text-xs font-semibold text-brand">Today</span>
            <button type="button" aria-label="Next day" className="text-muted">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {current && <CurrentJob job={current} />}
        {rest.map((j) => (
          <NextJob key={j.id} job={j} />
        ))}

        <div className="flex items-start gap-2.5 rounded-lg bg-brand-soft p-3.5">
          <MessageSquare size={18} strokeWidth={1.75} className="shrink-0 text-brand" />
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-brand">From dispatch {"·"} 7:45 AM</span>
            <p className="text-brand-deep">Gate code for Sarah&apos;s delivery: 4826. Use the loading entrance on Riverview.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Avatar label={me.initials} size={28} />
          {others.map((m) => (
            <Avatar key={m.name} label={m.initials} size={28} tone="neutral" />
          ))}
          <span className="text-[11px] text-muted">
            You, {others.map((m) => m.name).join(" & ")}
          </span>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted">
          <CloudCheck size={13} className="text-success" />
          All jobs synced {"·"} {NOW_LABEL}
        </div>
      </div>
    </>
  );
}
