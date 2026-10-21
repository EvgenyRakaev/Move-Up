"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Download, FileText, KeyRound, Link as LinkIcon, Mail, MapPin, Pencil, Phone, Send, TriangleAlert, Truck } from "lucide-react";
import { Avatar, Badge, Button, DetailRow, Divider, Panel, StatusBadge, TextLink } from "@/components/ui";
import { RouteMap } from "@/components/route-map";
import { PageHeading } from "@/components/manager-shell";
import { crews, manager, money, type Crew, type Job } from "@/lib/data";

const tabs = ["Overview", "Inventory", "Documents", "Activity"] as const;
type Tab = (typeof tabs)[number];

function estimateLines(job: Job) {
  const tax = Math.round(job.estimate * 0.04);
  const subtotal = job.estimate - tax;
  const materials = Math.round(subtotal * 0.125);
  const truck = 100;
  const stairs = /stairs/i.test(job.pickup.line2) ? 50 : 0;
  const labor = subtotal - materials - truck - stairs;
  const hours = job.endH - job.startH;
  return { tax, subtotal, materials, truck, stairs, labor, hours };
}

function activity(job: Job, crew: Crew | null) {
  const lead = crew?.members[0].name ?? "Dispatch";
  const deposit = money(Math.round(job.estimate * 0.3), true);
  if (job.status === "in-progress") {
    return [
      { title: "Loading started", meta: `${lead} · Today, 8:47 AM` },
      { title: "Crew checked in at pickup", meta: `${lead} · Today, ${job.startedAt ?? job.start}` },
      { title: `Deposit received · ${deposit}`, meta: "Customer · Sep 28, 2:14 PM" },
    ];
  }
  return [
    crew ? { title: `${crew.name} assigned`, meta: `${manager.name} · Oct 3, 4:20 PM` } : { title: "Waiting for crew assignment", meta: "Dispatch" },
    { title: `Deposit received · ${deposit}`, meta: "Customer · Sep 30, 11:02 AM" },
  ];
}

export function JobDetail({ job, crew: initialCrew }: { job: Job; crew: Crew | null }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [crew, setCrew] = useState<Crew | null>(initialCrew);
  const [reassigning, setReassigning] = useState(false);
  const [updateSent, setUpdateSent] = useState(false);

  const est = estimateLines(job);
  const deposit = Math.round(job.estimate * 0.3);
  const balance = job.estimate - deposit;
  const status = job.status === "needs-crew" && crew ? "scheduled" : job.status;
  const show = (t: Tab) => tab === "Overview" || tab === t;

  return (
    <>
      <Link href="/manager/jobs" className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline">
        <ArrowLeft size={14} />
        Back to jobs
      </Link>

      <PageHeading
        eyebrow={`JOB ${job.id}`}
        title={job.customer}
        subtitle={`${job.moveType} · ${job.size} · Created ${job.createdAt}`}
        actions={
          <>
            <StatusBadge status={status} />
            <Button icon={Pencil}>Edit job</Button>
            <Button icon={updateSent ? Check : Send} variant="primary" onClick={() => setUpdateSent(true)}>
              {updateSent ? "Update sent" : "Send update"}
            </Button>
          </>
        }
      />

      <div className="flex w-full gap-7 overflow-x-auto border-b border-line">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 pb-3 text-[13px] whitespace-nowrap ${
              tab === t ? "border-brand text-brand" : "border-transparent font-medium text-muted hover:text-ink"
            }`}
          >
            {t}
            {t === "Documents" && <span className="ml-2">3</span>}
          </button>
        ))}
      </div>

      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-5">
          {tab === "Overview" && (
            <Panel title="Customer contact" action={<TextLink>View customer profile {"→"}</TextLink>}>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar label={job.initials} size={48} textSize="text-sm" />
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span className="text-[15px] text-ink">{job.customer}</span>
                  <span className="text-[11px] text-muted">{job.customerSince}</span>
                </div>
                <div className="flex flex-col gap-2 text-xs text-brand">
                  <a href={`tel:${job.phone.replace(/\D/g, "")}`} className="flex items-center gap-2 hover:underline">
                    <Phone size={14} />
                    {job.phone}
                  </a>
                  <a href={`mailto:${job.email}`} className="flex items-center gap-2 hover:underline">
                    <Mail size={14} />
                    {job.email}
                  </a>
                </div>
              </div>
            </Panel>
          )}

          {tab === "Overview" && (
            <Panel
              title="Move itinerary"
              action={
                <span className="text-xs font-semibold text-brand">
                  Sun, Oct 4 {"·"} {job.start} {"–"} {job.end}
                </span>
              }
            >
              <div className="flex flex-col gap-6 sm:flex-row">
                <AddressBlock kind="pickup" label="PICKUP" line1={job.pickup.line1} line2={job.pickup.line2} />
                <AddressBlock kind="delivery" label="DELIVERY" line1={job.delivery.line1} line2={job.delivery.line2} />
              </div>
              <RouteMap from={job.pickup.area} to={job.delivery.area} distance={`${job.distance.replace(" miles", " mi")} · ${job.driveTime}`} />
              <div className="flex flex-wrap items-start justify-between gap-2 text-[11px]">
                <span className="text-muted">
                  Local move {"·"} {job.distance}
                  {/stairs/i.test(job.pickup.line2) && ` · No elevator at pickup`}
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(job.pickup.line1 + ", " + job.pickup.line2.split(" ·")[0])}&destination=${encodeURIComponent(
                    job.delivery.line1 + ", " + job.delivery.line2.split(" ·")[0],
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand hover:underline"
                >
                  Open directions {"↗"}
                </a>
              </div>
            </Panel>
          )}

          {show("Inventory") && (
            <Panel title="Inventory & move size" action={<TextLink>Edit inventory</TextLink>}>
              <div className="flex flex-wrap gap-2">
                <Badge tone="brand">{job.items} items</Badge>
                <Badge tone="neutral">{job.volume} cu ft</Badge>
                {job.fragile > 0 && <Badge tone="warn">{job.fragile} fragile items</Badge>}
              </div>
              <div>
                <div className="flex gap-4 bg-panel-alt py-2 text-[10px] font-semibold text-muted">
                  <span className="w-[120px] shrink-0 sm:w-[162px]">CATEGORY</span>
                  <span className="flex-1">ITEMS / HANDLING</span>
                  <span className="w-7 shrink-0 text-right">QTY</span>
                </div>
                {job.inventory.map((c) => (
                  <div key={c.key} className="flex min-h-[37px] items-center gap-4 border-b border-line py-2">
                    <span className="w-[120px] shrink-0 text-xs font-medium text-ink sm:w-[162px]">{c.name}</span>
                    <span className="flex-1 text-[11px] text-muted">{c.details}</span>
                    <span className="w-7 shrink-0 text-right text-xs font-semibold text-ink">{c.qty}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {tab === "Overview" && (
            <Panel title="Move notes" action={<TextLink>Add note</TextLink>}>
              <div className="flex items-start gap-2.5">
                <KeyRound size={16} className="mt-px shrink-0 text-brand" />
                <p className="text-xs text-ink">{job.accessNote}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <TriangleAlert size={16} className="mt-px shrink-0 text-warn" />
                <p className="text-xs text-ink">{job.handlingNote}</p>
              </div>
              <p className="text-[10px] text-subtle">
                Added by {manager.name} {"·"} Oct 3, 4:20 PM {"·"} Visible to crew
              </p>
            </Panel>
          )}

          {show("Documents") && (
            <Panel title="Documents" action={<TextLink>Upload file</TextLink>}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { title: "Accepted estimate", meta: "EST-0824 · Signed Sep 28" },
                  { title: "Inventory & access", meta: `${job.items} items · Updated Oct 3` },
                  { title: "Bill of lading", meta: `${job.id} · Ready for crew` },
                ].map((d) => (
                  <div key={d.title} className="flex flex-col gap-2 rounded-lg border border-line bg-panel-alt p-3">
                    <div className="flex items-start justify-between">
                      <FileText size={20} strokeWidth={1.75} className="text-brand" />
                      <button type="button" aria-label={`Download ${d.title}`} className="text-muted hover:text-ink">
                        <Download size={14} />
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-ink">{d.title}</p>
                    <p className="text-[10px] text-muted">{d.meta}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {tab === "Activity" && <ActivityPanel job={job} crew={crew} />}
        </div>

        {tab === "Overview" && (
          <div className="flex w-full shrink-0 flex-col gap-5 xl:w-[340px]">
            <Panel title="Estimate" action={<span className="text-xs font-semibold text-brand">EST-0824</span>}>
              <div className="flex items-center justify-between">
                <Badge tone="success">Accepted</Badge>
                <span className="text-[11px] text-muted">Sep 28, 2026</span>
              </div>
              <div className="flex flex-col gap-3">
                <DetailRow label={`Labor · ${crew?.members.length ?? job.moversNeeded} movers × ${est.hours} hr`} value={money(est.labor, true)} />
                <DetailRow label="Packing materials" value={money(est.materials, true)} />
                <DetailRow label="Truck & travel" value={money(est.truck, true)} />
                {est.stairs > 0 && <DetailRow label="Stair carry" value={money(est.stairs, true)} />}
                <Divider />
                <DetailRow label="Subtotal" value={money(est.subtotal, true)} />
                <DetailRow label="Tax" value={money(est.tax, true)} />
              </div>
              <div className="flex items-center justify-between text-ink">
                <span className="text-sm">Total estimate</span>
                <span className="text-[25px] font-bold">{money(job.estimate, true)}</span>
              </div>
              <Button icon={FileText} className="w-full">
                View estimate
              </Button>
            </Panel>

            <Panel title="Payment status">
              <Badge tone="success">Deposit paid</Badge>
              <div className="flex">
                <div className="h-[7px] rounded-[3px] bg-success" style={{ width: `${(deposit / job.estimate) * 100}%` }} />
                <div className="h-[7px] flex-1 rounded-[3px] bg-canvas" />
              </div>
              <DetailRow label="Deposit received" value={money(deposit, true)} valueClass="text-success" />
              <DetailRow label="Balance due" value={money(balance, true)} />
              <p className="text-[11px] text-muted">Balance due on completion {"·"} Visa {"••••"} 4242</p>
              <Button icon={LinkIcon} className="w-full">
                Send payment link
              </Button>
            </Panel>

            <Panel
              title="Crew & truck"
              action={
                <button type="button" onClick={() => setReassigning((v) => !v)} className="text-xs font-semibold text-brand hover:underline">
                  {crew ? "Reassign" : "Assign"}
                </button>
              }
            >
              {reassigning && (
                <select
                  autoFocus
                  value={crew?.id ?? ""}
                  onChange={(e) => {
                    setCrew(crews.find((c) => c.id === e.target.value) ?? null);
                    setReassigning(false);
                  }}
                  className="h-9 rounded-lg border border-brand-border bg-white px-2 text-xs text-ink"
                >
                  <option value="" disabled>
                    Pick a crew
                  </option>
                  {crews.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {"·"} {c.truck}
                    </option>
                  ))}
                </select>
              )}
              {crew ? (
                <>
                  <div className="flex items-center gap-2.5">
                    <Avatar label={crew.letter} />
                    <div className="flex flex-col">
                      <span className="text-sm text-ink">{crew.name}</span>
                      <span className="text-[11px] text-muted">
                        {crew.members.length} movers {"·"} {crew.members[0].name.split(" ")[0]} is crew lead
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[9px]">
                    {crew.members.map((m) => (
                      <div key={m.name} className="flex items-center gap-2">
                        <Avatar label={m.initials} size={24} tone="neutral" />
                        <span className="flex-1 text-xs text-ink">{m.name}</span>
                        <span className="text-[10px] text-muted">{m.role}</span>
                      </div>
                    ))}
                  </div>
                  <Divider />
                  <div className="flex items-center gap-2">
                    <Truck size={18} className="text-brand" />
                    <span className="text-xs font-semibold text-ink">{crew.truck}</span>
                    <span className="text-[11px] text-muted">
                      {crew.truckDesc} {"·"} {crew.truckCapacity}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-warn">
                  No crew assigned yet. {job.moversNeeded} movers needed.
                </p>
              )}
            </Panel>

            <ActivityPanel job={job} crew={crew} compact />
          </div>
        )}
      </div>
    </>
  );
}

function AddressBlock({ kind, label, line1, line2 }: { kind: "pickup" | "delivery"; label: string; line1: string; line2: string }) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${kind === "pickup" ? "bg-brand-soft text-brand" : "bg-success-soft text-success"}`}>
        <MapPin size={17} />
      </span>
      <div className="flex min-w-0 flex-col gap-[3px]">
        <span className="text-[10px] text-muted">{label}</span>
        <span className="text-[13px] font-semibold text-ink">{line1}</span>
        <span className="text-xs text-muted">{line2}</span>
      </div>
    </div>
  );
}

function ActivityPanel({ job, crew, compact = false }: { job: Job; crew: Crew | null; compact?: boolean }) {
  return (
    <Panel title="Latest activity" action={compact ? <TextLink>View all</TextLink> : undefined}>
      {activity(job, crew).map((a) => (
        <div key={a.title} className="flex items-start gap-[9px]">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-[3px] bg-brand" />
          <div className="flex flex-col gap-[3px]">
            <span className="text-xs font-medium text-ink">{a.title}</span>
            <span className="text-[10px] text-muted">{a.meta}</span>
          </div>
        </div>
      ))}
    </Panel>
  );
}
