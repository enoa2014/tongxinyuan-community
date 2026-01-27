import { WorkerShell } from "@/components/layout/worker-shell"

export default function WorkerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <WorkerShell>{children}</WorkerShell>
}
