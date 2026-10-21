import { Download, Plus } from "lucide-react";
import { PageHeading } from "@/components/manager-shell";
import { Button } from "@/components/ui";
import { DispatchBoard } from "./dispatch-board";

export default function JobsPage() {
  return (
    <>
      <PageHeading
        title="Jobs & dispatch"
        subtitle="Plan the day. Assign the right crew and keep your fleet moving."
        actions={
          <>
            <Button icon={Download}>Export</Button>
            <Button icon={Plus} variant="primary">
              New job
            </Button>
          </>
        }
      />
      <DispatchBoard />
    </>
  );
}
