
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { pb } from "@/lib/pocketbase"
import { Loader2 } from "lucide-react"

import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

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
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar - Now Sticky */}
            <div className="sticky top-0 h-screen w-64 flex-none z-30">
                <AdminSidebar />
            </div>

            <div className="flex flex-1 flex-col min-w-0">
                {/* Header */}
                <AdminHeader />

                {/* Main Content Area */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
