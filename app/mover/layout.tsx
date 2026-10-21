import { MoverShell } from "@/components/mover-shell";

export default function MoverLayout({ children }: { children: React.ReactNode }) {
  return <MoverShell>{children}</MoverShell>;
}
