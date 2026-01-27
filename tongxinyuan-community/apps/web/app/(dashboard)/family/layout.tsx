import { FamilyShell } from "@/components/layout/family-shell"

export default function FamilyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <FamilyShell>{children}</FamilyShell>
}
