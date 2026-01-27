import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <DashboardSidebar />
            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-slate-100/40 px-6 dark:bg-slate-800/40">
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                {/* Search Placeholder */}
                                <span className="text-sm text-slate-400">全局搜索 (Ctrl+K)</span>
                            </div>
                        </form>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
