import { notFound } from "next/navigation";
import { MoverSubBar } from "@/components/mover-shell";
import { getCrew, getJob, jobs } from "@/lib/data";
import { Checklist } from "./checklist";

export function generateStaticParams() {
  return jobs.map((j) => ({ id: j.id }));
}

export default async function ChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();
  const crew = getCrew(job.crewId) ?? null;
  const next = jobs
    .filter((j) => j.crewId && j.crewId === job.crewId && j.startH > job.startH)
    .sort((a, b) => a.startH - b.startH)[0];

  return (
    <>
      <MoverSubBar title="Job checklist" subtitle={`${job.customer} · ${job.id}`} backHref={`/mover/jobs/${job.id}`} />
      <Checklist job={job} crew={crew} next={next ? { customer: next.customer, start: next.start } : null} />
    </>
  );
}
