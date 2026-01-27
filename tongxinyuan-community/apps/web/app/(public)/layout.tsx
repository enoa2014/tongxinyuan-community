import { PublicNavbar } from "@/components/layout/public-navbar"
import { SiteFooter } from "@/components/layout/site-footer"

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <PublicNavbar />
            <main className="flex-1">
                {children}
            </main>
            <SiteFooter />
        </div>
    )
}
