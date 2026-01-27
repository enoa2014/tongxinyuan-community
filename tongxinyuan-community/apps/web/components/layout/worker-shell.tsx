"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Scan, FileText, Settings, LogOut, CheckSquare } from "lucide-react"

export function WorkerShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const sidebarItems = [
        { href: "/dashboard/worker", label: "工作台", icon: LayoutDashboard },
        { href: "/dashboard/worker/approval", label: "审批中心", icon: CheckSquare },
        { href: "/dashboard/worker/families", label: "家庭管理", icon: Users },
        { href: "/dashboard/worker/content", label: "内容发布", icon: FileText },
    ]

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar (Desktop) */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex-col hidden md:flex shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <span className="font-bold text-white tracking-wider">同心源·驾驶舱</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === item.href
                                    ? "bg-teal-600/20 text-teal-400"
                                    : "hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white w-full">
                        <LogOut className="h-4 w-4" />
                        退出登录
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full z-30 bg-slate-900 text-white h-14 flex items-center justify-between px-4">
                <span className="font-bold">社工工作台</span>
                <Link href="/dashboard/worker/mobile" className="p-2 bg-teal-600 rounded-full">
                    <Scan className="h-4 w-4" />
                </Link>
            </div>

            {/* Main */}
            <main className="flex-1 md:p-8 pt-16 md:pt-8 p-4 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    )
}
