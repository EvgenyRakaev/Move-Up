"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, CircleCheck, CloudCheck, ListChecks, PenLine, Timer } from "lucide-react";
import { Badge, Button, DetailRow, Panel } from "@/components/ui";
import type { Crew, Job } from "@/lib/data";

type Stage = { title: string; duration: string; tasks: string[] };

function stagesFor(job: Job, crew: Crew | null): Stage[] {
  return [
    {
      title: "Packing & preparation",
      duration: "35 min",
      tasks: ["Confirm inventory with customer", "Wrap glass table & framed mirror", "Photograph existing condition"],
    },
    {
      title: "Loading",
      duration: "1 hr 25 min",
      tasks: [`Load all ${job.items} items into ${crew?.truck ?? "the truck"}`, "Secure furniture with straps", "Complete pickup walkthrough"],
    },
    {
      title: "Delivery & unloading",
      duration: "1 hr 26 min",
      tasks: ["Place items in designated rooms", "Inspect items · No damage reported", "Collect customer signature"],
    },
  ];
}

const SIGNATURE_TASK = "Collect customer signature";

type State = { done: string[]; signedAt: string | null };

function initialState(job: Job, stages: Stage[]): State {
  // In-progress jobs start with packing done and loading underway.
  if (job.status === "in-progress") {
    return { done: [...stages[0].tasks, stages[1].tasks[0]], signedAt: null };
  }
  return { done: [], signedAt: null };
}

function nowLabel() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function Checklist({ job, crew, next }: { job: Job; crew: Crew | null; next: { customer: string; start: string } | null }) {
  const stages = stagesFor(job, crew);
  const allTasks = stages.flatMap((s) => s.tasks);
  const storageKey = `movebase:checklist:${job.id}`;

  const [state, setState] = useState<State>(() => initialState(job, stages));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setState(JSON.parse(raw) as State);
    } catch {
      /* storage unavailable: keep defaults */
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, loaded, storageKey]);

  const doneSet = new Set(state.done);
  const doneCount = allTasks.filter((t) => doneSet.has(t)).length;
  const complete = doneCount === allTasks.length && !!state.signedAt;

  function toggle(task: string) {
    if (task === SIGNATURE_TASK && !state.signedAt) return; // signature is collected in the sign-off panel
    setState((s) => ({ ...s, done: s.done.includes(task) ? s.done.filter((t) => t !== task) : [...s.done, task] }));
  }

  function sign() {
    setState((s) => ({ done: s.done.includes(SIGNATURE_TASK) ? s.done : [...s.done, SIGNATURE_TASK], signedAt: nowLabel() }));
  }

  function reset() {
    setState(initialState(job, stages));
  }

  return (
    <div className="flex flex-col gap-5 px-5 py-6">
      {complete ? (
        <section className="flex flex-col items-center gap-2.5 rounded-xl bg-success-soft p-5 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-success">
            <Check size={25} strokeWidth={2.5} className="text-white" />
          </span>
          <h1 className="text-[22px] font-bold text-success">Move completed</h1>
          <p className="text-xs text-success">
            Today at {state.signedAt} {"·"} Nice work, {crew?.name ?? "team"}.
          </p>
          <p className="flex items-center gap-2 text-[11px] font-semibold text-success">
            <ListChecks size={15} />
            {doneCount} of {allTasks.length} tasks complete {"·"} {job.items} items delivered
          </p>
        </section>
      ) : (
        <section className="flex flex-col gap-2.5 rounded-xl bg-brand-soft p-5">
          <h1 className="text-[22px] font-bold text-brand-deep">Move in progress</h1>
          <p className="text-xs text-brand">
            {doneCount} of {allTasks.length} tasks done {"·"} Tick tasks as the crew finishes them.
          </p>
          <div className="flex h-[7px] overflow-hidden rounded-[3px] bg-white">
            <div className="h-full bg-brand transition-all" style={{ width: `${(doneCount / allTasks.length) * 100}%` }} />
          </div>
        </section>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg text-ink">Move checklist</h2>
        {complete ? <Badge tone="success">Completed</Badge> : <Badge tone="brand">In progress</Badge>}
      </div>

      {stages.map((stage) => {
        const stageDone = stage.tasks.filter((t) => doneSet.has(t)).length;
        return (
          <section key={stage.title} className="flex flex-col gap-3.5 rounded-xl border border-line bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[15px] text-ink">{stage.title}</h3>
              <span className="text-[11px] whitespace-nowrap text-muted">
                {stageDone === stage.tasks.length ? `${stage.duration} · ` : ""}
                {stageDone}/{stage.tasks.length} done
              </span>
            </div>
            <ul className="flex flex-col gap-[11px]">
              {stage.tasks.map((task) => {
                const checked = doneSet.has(task);
                const locked = task === SIGNATURE_TASK && !state.signedAt;
                return (
                  <li key={task}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => toggle(task)}
                      disabled={locked}
                      className="flex w-full items-center gap-2.5 text-left disabled:cursor-not-allowed"
                    >
                      <span
                        className={`flex size-[18px] shrink-0 items-center justify-center rounded-[5px] ${
                          checked ? "bg-success" : "border-[1.5px] border-[#c5cfde] bg-white"
                        }`}
                      >
                        {checked && <Check size={13} strokeWidth={3} className="text-white" />}
                      </span>
                      <span className={`flex-1 text-xs ${locked ? "text-muted" : "text-ink"}`}>
                        {task}
                        {locked && " · sign below"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <Panel title="Time tracking" action={<span className="text-xs font-semibold text-brand">{complete ? "Timer stopped" : "Timer running"}</span>} padding="p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[29px] font-bold text-ink">{complete ? "3h 54m" : "1h 29m"}</span>
            <span className="text-[11px] text-muted">
              Total job time {"·"} {job.durationLabel.replace(" hours estimated", " hr estimated")}
            </span>
          </div>
          <span className={`flex size-10 items-center justify-center rounded-full ${complete ? "bg-canvas text-muted" : "bg-brand-soft text-brand"}`}>
            <Timer size={20} strokeWidth={1.75} />
          </span>
        </div>
        <div className="flex gap-[3px]">
          <div className="h-[7px] flex-[44] rounded-[3px] bg-brand-pale" />
          <div className="h-[7px] flex-[110] rounded-[3px] bg-brand" />
          <div className="h-[7px] flex-[36] rounded-[3px] bg-travel" />
          <div className={`h-[7px] flex-[119] rounded-[3px] ${complete ? "bg-success" : "bg-canvas"}`} />
        </div>
        <DetailRow label="Start / finish" value={`${job.startedAt ?? job.start} / ${complete ? state.signedAt : "—"}`} />
        <DetailRow label="Travel time included" value="28 min" />
        <DetailRow label="Crew" value={`${crew?.name.replace(" crew", "") ?? "—"} · ${crew?.members.length ?? 0} movers`} />
        {complete && (
          <p className="flex items-center gap-1.5 text-[11px] text-success">
            <CircleCheck size={13} />
            Timesheet saved for all crew members
          </p>
        )}
      </Panel>

      <Panel title="Customer sign-off" padding="p-4">
        {state.signedAt ? (
          <>
            <div className="flex h-[55px] items-center justify-center rounded-md bg-panel-alt">
              <span className="font-signature text-[25px] text-navy italic">{job.customer}</span>
            </div>
            <div className="flex items-start justify-between text-[11px]">
              <span className="font-semibold text-ink">{job.customer}</span>
              <span className="text-muted">Signed at {state.signedAt}</span>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={sign}
            disabled={doneCount < allTasks.length - 1}
            className="flex h-[55px] items-center justify-center gap-2 rounded-md border border-dashed border-[#c5cfde] bg-panel-alt text-xs font-semibold text-brand disabled:cursor-not-allowed disabled:text-subtle"
          >
            <PenLine size={16} />
            {doneCount < allTasks.length - 1 ? "Finish the other tasks to collect a signature" : "Tap to collect customer signature"}
          </button>
        )}
      </Panel>

      {complete && (
        <div className="flex items-start gap-2 rounded-lg bg-brand-soft p-3">
          <CloudCheck size={17} className="shrink-0 text-brand" />
          <p className="text-xs text-brand-deep">Completion report sent to dispatch. Customer receipt and 3 delivery photos attached.</p>
        </div>
      )}

      <Button href="/mover" icon={ArrowRight} variant="primary" className="w-full">
        Back to today&apos;s jobs
      </Button>

      {next && (
        <p className="text-center text-[11px] text-muted">
          Next up: {next.customer} {"·"} {next.start}
        </p>
      )}

      {(complete || state.done.length !== initialState(job, stages).done.length) && (
        <button type="button" onClick={reset} className="text-center text-[11px] text-subtle underline">
          Reset demo checklist
        </button>
      )}
    </div>
  );
}
