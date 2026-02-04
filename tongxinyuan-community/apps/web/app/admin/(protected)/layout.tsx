
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { pb } from "@/lib/pocketbase"
import { Loader2 } from "lucide-react"

import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { MobileHeader } from "@/components/admin/mobile-header"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

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
        <SidebarProvider>
            {/* Desktop Sidebar */}
            <AppSidebar />

            <SidebarInset>
                {/* Mobile Header - Visible only on Mobile */}
                <div className="md:hidden sticky top-0 z-30 w-full">
                    <MobileHeader />
                </div>

                <div className="flex flex-col flex-1 h-screen overflow-hidden">
                    {/* Desktop Header with trigger */}
                    <div className="hidden md:flex items-center p-4 border-b bg-white gap-4">
                        <SidebarTrigger />
                        <AdminHeader />
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
                        {children}
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
