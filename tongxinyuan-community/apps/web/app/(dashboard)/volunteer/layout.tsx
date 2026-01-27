import { VolunteerShell } from "@/components/layout/volunteer-shell"

export default function VolunteerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <VolunteerShell>{children}</VolunteerShell>
}
