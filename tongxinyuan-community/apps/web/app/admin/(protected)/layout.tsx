
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <AdminSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <AdminHeader />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
