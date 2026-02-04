
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { pb } from "@/lib/pocketbase"
import { Loader2 } from "lucide-react"

import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { MobileHeader } from "@/components/admin/mobile-header"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        // Check if user is logged in
        if (!pb.authStore.isValid) {
            router.push("/admin/login")
        } else {
            setIsAuthorized(true)
        }
    }, [router])

    // Prevent flashing of protected content
    if (!isAuthorized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-slate-50 flex-col md:flex-row">
            {/* Mobile Header - Visible only on Mobile */}
            <div className="md:hidden sticky top-0 z-30 w-full">
                <MobileHeader />
            </div>

            {/* Sidebar - Desktop Only */}
            <div className="hidden md:block sticky top-0 h-screen w-64 flex-none z-30">
                <AdminSidebar />
            </div>

            <div className="flex flex-1 flex-col min-w-0">
                {/* Desktop Header - Visible only on Desktop */}
                <div className="hidden md:block">
                    <AdminHeader />
                </div>

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
