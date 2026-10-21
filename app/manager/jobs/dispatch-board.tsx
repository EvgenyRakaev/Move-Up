"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Ellipsis, Search, SlidersHorizontal, TriangleAlert } from "lucide-react";
import { Avatar, Badge, Panel, StatusBadge, TextLink } from "@/components/ui";
import { NOW_H, NOW_LABEL, TODAY_LONG, TOTAL_JOBS_TODAY, crews, jobs as seedJobs, money, routeLabel, type Job, type JobStatus } from "@/lib/data";

const DAY_START = 8;
const DAY_END = 18;
const SPAN = DAY_END - DAY_START;
const HOURS = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"];
const pct = (h: number) => `${((h - DAY_START) / SPAN) * 100}%`;

const tabs = ["Dispatch board", "All jobs", "Calendar"] as const;

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative inline-flex h-[34px] items-center gap-2 rounded-lg border border-line bg-white px-3.5 hover:bg-panel-alt">
      <ChevronDown size={16} className="text-ink" />
      <span className="text-[13px] font-semibold whitespace-nowrap text-ink">{options.find((o) => o.value === value)?.label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Filter"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function blockStyle(status: JobStatus) {
  if (status === "in-progress") return "bg-brand-soft border-brand-border border-l-brand-border";
  return "bg-canvas border-line border-l-line";
}

export function DispatchBoard() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Dispatch board");
  const [jobs, setJobs] = useState<Job[]>(seedJobs);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [crewFilter, setCrewFilter] = useState("all");
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const needsCrew = jobs.filter((j) => j.status === "needs-crew");

  const filtered = useMemo(
    () =>
      jobs.filter((j) => {
        const q = query.trim().toLowerCase();
        if (q && !j.customer.toLowerCase().includes(q) && !j.id.toLowerCase().includes(q)) return false;
        if (status !== "all" && j.status !== status) return false;
        if (crewFilter !== "all" && (j.crewId ?? "none") !== crewFilter) return false;
        return true;
      }),
    [jobs, query, status, crewFilter],
  );

  const total = jobs.reduce((s, j) => s + j.estimate, 0) + 3600; // remaining 3 jobs not in the mock list

  function assign(jobId: string, crewId: string) {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, crewId, status: "scheduled" } : j)));
    setAssigningId(null);
  }

  function crewLaneJobs(crewId: string) {
    return jobs.filter((j) => j.crewId === crewId).sort((a, b) => a.startH - b.startH);
  }

  function availableWindow(crewId: string) {
    const lane = crewLaneJobs(crewId);
    const lastEnd = lane.length ? Math.max(...lane.map((j) => j.endH)) : DAY_START;
    const from = lastEnd + 1;
    // only advertise a window that leaves room for a typical half-day move
    if (from > DAY_END - 3) return null;
    return { from, to: Math.min(from + 3, DAY_END) };
  }

  return (
    <>
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex gap-[3px] rounded-lg bg-tab-track p-1">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold ${tab === t ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex h-[34px] items-center rounded-lg border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-panel-alt">
            Today
          </button>
          <button type="button" aria-label="Previous day" className="text-ink">
            <ChevronLeft size={17} />
          </button>
          <span className="text-[13px] font-semibold whitespace-nowrap text-ink">{TODAY_LONG}</span>
          <button type="button" aria-label="Next day" className="text-ink">
            <ChevronRight size={17} />
          </button>
          <button type="button" className="inline-flex h-[34px] items-center gap-2 rounded-lg border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-panel-alt">
            <ChevronDown size={16} />
            Day
          </button>
        </div>
      </div>

      {needsCrew.length > 0 && (
        <div className="flex w-full flex-wrap items-center gap-3 rounded-lg border border-warn-border bg-warn-soft px-4 py-3 text-xs text-warn">
          <TriangleAlert size={18} strokeWidth={1.75} />
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            <span>
              {needsCrew.length} job{needsCrew.length > 1 ? "s" : ""} need{needsCrew.length > 1 ? "" : "s"} a crew.
            </span>
            <span>
              {needsCrew[0].customer} {"·"} {needsCrew[0].start} {"·"} {needsCrew[0].id}
            </span>
          </div>
          <button type="button" onClick={() => setAssigningId(needsCrew[0].id)} className="hover:underline">
            Assign now {"→"}
          </button>
        </div>
      )}

      {tab === "Dispatch board" && (
        <Panel title="Crew & truck schedule" action={<TextLink>Manage availability</TextLink>}>
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="flex gap-4 text-[10px] text-muted">
                <span className="w-[150px] shrink-0 font-semibold">{crews.length} ACTIVE CREWS</span>
                <div className="flex flex-1 justify-between">
                  {HOURS.map((h) => (
                    <span key={h}>{h}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-col">
                {crews.map((crew) => {
                  const lane = crewLaneJobs(crew.id);
                  const avail = availableWindow(crew.id);
                  return (
                    <div key={crew.id} className="flex items-center gap-4">
                      <div className="flex w-[150px] shrink-0 items-center gap-[9px]">
                        <Avatar label={crew.letter} />
                        <div className="flex flex-col gap-[3px]">
                          <span className="text-xs text-ink">{crew.name}</span>
                          <span className="text-[10px] text-muted">
                            {crew.members.length} movers {"·"} {crew.truck}
                          </span>
                        </div>
                      </div>
                      <div className="relative h-[78px] flex-1 overflow-hidden border-b border-line bg-panel-alt">
                        {[0, 2, 4, 6, 8, 10].map((h) => (
                          <div key={h} className="absolute top-0 h-full w-px bg-line" style={{ left: `${(h / SPAN) * 100}%` }} />
                        ))}
                        <div className="absolute top-0 h-full w-px bg-brand" style={{ left: pct(NOW_H) }} />
                        {lane.map((job) => {
                          const live = job.status === "in-progress";
                          return (
                            <Link
                              key={job.id}
                              href={`/manager/jobs/${job.id}`}
                              className={`absolute top-2 flex h-[60px] flex-col gap-1 overflow-hidden rounded-md border border-l-[3px] p-2.5 whitespace-nowrap hover:brightness-[0.98] ${blockStyle(job.status)}`}
                              style={{ left: pct(job.startH), width: `calc(${((job.endH - job.startH) / SPAN) * 100}% - 2px)` }}
                            >
                              <span className={`text-xs ${live ? "text-brand-deep" : "text-ink"}`}>
                                {job.customer}
                                {live && ` · ${job.id}`}
                              </span>
                              <span className="text-[10px] text-muted">
                                {job.start.replace(/ (AM|PM)$/, job.start.slice(-2) === job.end.slice(-2) ? "" : " $1")} {"–"} {job.end}
                                {live ? ` · ${job.sizeShort}` : ` · ${job.id}`}
                              </span>
                            </Link>
                          );
                        })}
                        {avail && (
                          <div
                            className="absolute top-2 flex h-[60px] flex-col gap-1 overflow-hidden rounded-md border border-l-[3px] border-line bg-success-soft p-2.5 whitespace-nowrap"
                            style={{ left: pct(avail.from), width: `${((avail.to - avail.from) / SPAN) * 100}%` }}
                          >
                            <span className="text-xs text-ink">Available for assignment</span>
                            <span className="text-[10px] text-muted">
                              {formatHour(avail.from)} onward
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <div className="flex gap-4">
              <Badge tone="brand">In progress</Badge>
              <Badge tone="neutral">Scheduled</Badge>
              <Badge tone="success">Available</Badge>
            </div>
            <span className="text-[10px] text-brand">
              {"│"} Current time {"·"} {NOW_LABEL}
            </span>
          </div>
        </Panel>
      )}

      {tab === "Calendar" && (
        <Panel title="Calendar">
          <p className="text-[13px] text-muted">Calendar view is coming in the next iteration.</p>
        </Panel>
      )}

      <Panel
        title="Today's job list"
        action={
          <span className="text-xs font-semibold text-brand">
            {TOTAL_JOBS_TODAY} jobs {"·"} {money(total)} estimated
          </span>
        }
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-line bg-panel-alt px-2.5 sm:w-[260px]">
            <Search size={15} className="text-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer or job ID"
              className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-subtle"
            />
          </label>
          <FilterSelect
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "All statuses" },
              { value: "in-progress", label: "In progress" },
              { value: "scheduled", label: "Scheduled" },
              { value: "needs-crew", label: "Needs crew" },
              { value: "completed", label: "Completed" },
            ]}
          />
          <FilterSelect
            value={crewFilter}
            onChange={setCrewFilter}
            options={[
              { value: "all", label: "All crews" },
              ...crews.map((c) => ({ value: c.id, label: c.name })),
              { value: "none", label: "Unassigned" },
            ]}
          />
          <button type="button" className="inline-flex h-[34px] items-center gap-2 rounded-lg border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-panel-alt">
            <SlidersHorizontal size={16} />
            More filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            <div className="flex gap-3 bg-panel-alt py-2.5 text-[10px] font-semibold text-muted">
              <span className="flex-1">CUSTOMER / JOB</span>
              <span className="w-[95px] shrink-0">SCHEDULE</span>
              <span className="w-[180px] shrink-0">ROUTE</span>
              <span className="w-[110px] shrink-0">CREW</span>
              <span className="w-[60px] shrink-0">TRUCK</span>
              <span className="w-[108px] shrink-0">STATUS</span>
              <span className="w-[76px] shrink-0">ESTIMATE</span>
              <span className="w-4 shrink-0" />
            </div>
            {filtered.map((job) => {
              const crew = crews.find((c) => c.id === job.crewId);
              const unassigned = !crew;
              return (
                <div
                  key={job.id}
                  className={`flex h-[72px] items-center gap-3 border-b border-line ${unassigned ? "bg-warn-row" : "bg-white hover:bg-panel-alt"}`}
                >
                  <Link href={`/manager/jobs/${job.id}`} className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <span className="truncate text-xs text-ink hover:underline">{job.customer}</span>
                    <span className="truncate text-[10px] text-muted">
                      {job.id} {"·"} {job.size}
                    </span>
                  </Link>
                  <div className="flex w-[95px] shrink-0 flex-col gap-[3px]">
                    <span className="text-xs text-ink">{job.start}</span>
                    <span className="text-[10px] text-muted">to {job.end}</span>
                  </div>
                  <span className="w-[180px] shrink-0 truncate text-[11px] text-muted">{routeLabel(job)}</span>
                  <div className="relative flex w-[110px] shrink-0 flex-col gap-[3px]">
                    {unassigned ? (
                      assigningId === job.id ? (
                        <select
                          autoFocus
                          defaultValue=""
                          onChange={(e) => e.target.value && assign(job.id, e.target.value)}
                          onBlur={() => setAssigningId(null)}
                          className="h-8 rounded-md border border-brand-border bg-white px-1 text-xs text-ink"
                        >
                          <option value="" disabled>
                            Pick a crew
                          </option>
                          {crews.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <>
                          <button type="button" onClick={() => setAssigningId(job.id)} className="text-left text-xs font-semibold text-brand hover:underline">
                            Assign crew
                          </button>
                          <span className="text-[10px] text-muted">{job.moversNeeded} movers needed</span>
                        </>
                      )
                    ) : (
                      <>
                        <span className="text-xs text-ink">{crew.name}</span>
                        <span className="text-[10px] text-muted">{crew.members.length} movers</span>
                      </>
                    )}
                  </div>
                  <span className="w-[60px] shrink-0 text-xs">
                    {unassigned ? (
                      <button type="button" onClick={() => setAssigningId(job.id)} className="text-brand hover:underline">
                        Assign
                      </button>
                    ) : (
                      <span className="text-ink">{crew.truck}</span>
                    )}
                  </span>
                  <div className="w-[108px] shrink-0">
                    <StatusBadge status={job.status} />
                  </div>
                  <span className="w-[76px] shrink-0 text-xs text-ink">{money(job.estimate)}</span>
                  <button type="button" aria-label="More actions" className="w-4 shrink-0 text-muted hover:text-ink">
                    <Ellipsis size={16} />
                  </button>
                </div>
              );
            })}
            {filtered.length === 0 && <p className="py-6 text-center text-xs text-muted">No jobs match these filters.</p>}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-muted">
            Showing 1{"–"}
            {filtered.length} of {TOTAL_JOBS_TODAY} jobs
          </span>
          <div className="flex items-center gap-2">
            <button type="button" className="inline-flex h-[34px] items-center rounded-lg border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-panel-alt">
              Previous
            </button>
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-brand-soft text-xs font-semibold text-brand">1</span>
            <button type="button" className="inline-flex h-[34px] items-center rounded-lg border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-panel-alt">
              Next
            </button>
          </div>
        </div>
      </Panel>
    </>
  );
}

function formatHour(h: number) {
  const hr = Math.floor(h);
  const min = Math.round((h - hr) * 60);
  const suffix = hr >= 12 ? "PM" : "AM";
  const h12 = hr % 12 === 0 ? 12 : hr % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${suffix}`;
}
