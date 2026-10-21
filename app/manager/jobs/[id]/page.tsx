import { notFound } from "next/navigation";
import { getCrew, getJob, jobs } from "@/lib/data";
import { JobDetail } from "./job-detail";

export function generateStaticParams() {
  return jobs.map((j) => ({ id: j.id }));
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();
  return <JobDetail job={job} crew={getCrew(job.crewId) ?? null} />;
}
