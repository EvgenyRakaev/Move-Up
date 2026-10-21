import { notFound } from "next/navigation";
import { Armchair, BedDouble, CalendarClock, Headset, KeyRound, ListChecks, MapPin, MessageCircle, Navigation, Package, Phone, Refrigerator, Route, Sofa, TriangleAlert, Truck, type LucideIcon } from "lucide-react";
import { MoverSubBar } from "@/components/mover-shell";
import { Avatar, Badge, Button, Divider, Panel, StatusBadge } from "@/components/ui";
import { TODAY_LONG, getCrew, getJob, jobs, type InventoryCategory } from "@/lib/data";

export function generateStaticParams() {
  return jobs.map((j) => ({ id: j.id }));
}

const inventoryIcon: Record<InventoryCategory["key"], LucideIcon> = {
  boxes: Package,
  living: Sofa,
  bedroom: BedDouble,
  dining: Armchair,
  appliances: Refrigerator,
};

function directionsUrl(from: string, to: string) {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`;
}

export default async function MoverJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();
  const crew = getCrew(job.crewId);
  const [gate, ...accessRest] = job.accessNote.split(". ");
  const pickupCity = job.pickup.line2.split(" ·")[0];
  const deliveryCity = job.delivery.line2.split(" ·")[0];

  return (
    <>
      <MoverSubBar title="Move details" subtitle={job.id} backHref="/mover" />
      <div className="flex flex-col gap-5 px-5 py-6">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted uppercase">{TODAY_LONG}</span>
            <StatusBadge status={job.status} />
          </div>
          <h1 className="text-[25px] font-bold text-ink">{job.customer}</h1>
          <p className="text-[13px] text-muted">
            {job.size} {"·"} Local move
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-brand-soft p-4">
          <CalendarClock size={22} strokeWidth={1.75} className="text-brand" />
          <div className="flex flex-col gap-1">
            <span className="text-sm text-brand-deep">
              {job.start} {"–"} {job.end}
            </span>
            <span className="text-[11px] text-brand">
              {job.durationLabel}
              {job.startedAt && ` · Started ${job.startedAt}`}
            </span>
          </div>
        </div>

        <Panel title="Your route" padding="p-4">
          <RouteStop tone="brand" label="PICKUP" line1={job.pickup.line1} line2={job.pickup.line2} />
          <Divider />
          <RouteStop tone="success" label="DELIVERY" line1={job.delivery.line1} line2={job.delivery.line2} />
          <div className="flex items-center gap-[7px] text-[11px] text-muted">
            <Route size={15} strokeWidth={1.75} />
            {job.distance} {"·"} About {job.driveTime} drive
          </div>
          <a
            href={directionsUrl(`${job.pickup.line1}, ${pickupCity}`, `${job.delivery.line1}, ${deliveryCity}`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-line bg-white text-[13px] font-semibold text-ink hover:bg-panel-alt"
          >
            <Navigation size={16} />
            Open directions
          </a>
        </Panel>

        <Panel padding="p-4">
          <div className="flex items-center gap-2.5">
            <Avatar label={job.initials} size={40} textSize="text-sm" />
            <div className="flex flex-1 flex-col gap-[3px]">
              <span className="text-sm text-ink">{job.customer}</span>
              <span className="text-xs text-muted">{job.phone}</span>
            </div>
            <Badge tone="neutral">Customer</Badge>
          </div>
          <div className="flex gap-2">
            <a
              href={`tel:${job.phone.replace(/\D/g, "")}`}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-white text-[13px] font-semibold text-ink hover:bg-panel-alt"
            >
              <Phone size={16} />
              Call customer
            </a>
            <a
              href={`sms:${job.phone.replace(/\D/g, "")}`}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-white text-[13px] font-semibold text-ink hover:bg-panel-alt"
            >
              <MessageCircle size={16} />
              Message
            </a>
          </div>
        </Panel>

        <Panel title="Inventory" action={<span className="text-xs font-semibold text-brand">{job.items} items</span>} padding="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted">Est. volume: {job.volume} cu ft</span>
            {job.fragile > 0 && <Badge tone="warn">{job.fragile} fragile items</Badge>}
          </div>
          <div className="flex flex-col gap-[11px]">
            {job.inventory.map((c) => {
              const Icon = inventoryIcon[c.key];
              return (
                <div key={c.key} className="flex items-center gap-2.5">
                  <Icon size={16} strokeWidth={1.75} className="text-muted" />
                  <span className="flex-1 text-xs text-ink">{c.name}</span>
                  <span className="text-xs font-semibold text-ink">{c.qty}</span>
                </div>
              );
            })}
          </div>
          <a href="#" className="text-[11px] font-semibold text-brand">
            View itemized inventory {"→"}
          </a>
        </Panel>

        <Panel title="Move notes" padding="p-4">
          <div className="flex items-start gap-[9px]">
            <KeyRound size={16} className="shrink-0 text-brand" />
            <div className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-ink">{gate}</span>
              {accessRest.length > 0 && <p className="text-muted">{accessRest.join(". ").replace("minutes", "min")}</p>}
            </div>
          </div>
          <Divider />
          <div className="flex items-start gap-[9px]">
            <TriangleAlert size={16} className="shrink-0 text-warn" />
            <div className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-ink">Handle with care</span>
              <p className="text-muted">{job.handlingNote}</p>
            </div>
          </div>
        </Panel>

        {crew && (
          <div className="flex items-center gap-2.5 rounded-lg border border-line bg-white p-3.5">
            <Truck size={22} strokeWidth={1.75} className="text-brand" />
            <div className="flex flex-col gap-[3px]">
              <span className="text-xs text-ink">
                {crew.name} {"·"} Truck {crew.truck}
              </span>
              <span className="text-[11px] text-muted">
                {crew.members.map((m) => m.name.split(" ")[0]).join(", ").replace(/, ([^,]*)$/, " & $1")} {"·"} {crew.truckDesc}
              </span>
            </div>
          </div>
        )}

        <Button href={`/mover/jobs/${job.id}/checklist`} icon={ListChecks} variant="primary" className="w-full">
          Open job checklist
        </Button>

        <a href="#" className="flex items-center justify-center gap-1.5 text-xs font-semibold text-brand">
          <Headset size={14} />
          Need help? Contact dispatch
        </a>
      </div>
    </>
  );
}

function RouteStop({ tone, label, line1, line2 }: { tone: "brand" | "success"; label: string; line1: string; line2: string }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${tone === "brand" ? "bg-brand-soft text-brand" : "bg-success-soft text-success"}`}
      >
        <MapPin size={17} />
      </span>
      <div className="flex flex-col gap-[3px]">
        <span className="text-[10px] text-muted">{label}</span>
        <span className="text-[13px] font-semibold text-ink">{line1}</span>
        <span className="text-xs text-muted">{line2}</span>
      </div>
    </div>
  );
}
