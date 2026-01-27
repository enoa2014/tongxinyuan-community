"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ClipboardList, Utensils, User, Activity } from "lucide-react"

export function FamilyShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const navItems = [
        {
            href: "/dashboard/family",
            label: "首页",
            icon: Home
        },
        {
            href: "/dashboard/family/apply",
            label: "申请",
            icon: ClipboardList
        },
        {
            href: "/dashboard/family/tracker",
            label: "进度",
            icon: Activity
        },
        {
            href: "/dashboard/family/kitchen",
            label: "厨房",
            icon: Utensils
        },
        {
            href: "/dashboard/family/profile",
            label: "我的",
            icon: User
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
            {/* Top Bar (Mobile Only) */}
            <div className="sticky top-0 z-30 flex h-14 items-center justify-center bg-white/80 backdrop-blur border-b border-slate-200 md:hidden">
                <span className="font-bold text-lg text-medical-primary">同心源·家</span>
            </div>

            {/* Desktop Sidebar Placeholder (Simplified for now) */}
            <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-r bg-white">
                <div className="flex h-16 items-center border-b px-6">
                    <span className="font-bold text-xl text-teal-600">同心源·家</span>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === item.href
                                    ? "bg-teal-50 text-teal-700"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="md:pl-64">
                <div className="container max-w-lg mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>

            {/* Bottom Nav (Mobile Only) */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden safe-area-bottom">
                <div className="flex h-16 items-center justify-around">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${pathname === item.href
                                    ? "text-teal-600"
                                    : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${pathname === item.href ? "fill-current" : ""}`} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    )
}
