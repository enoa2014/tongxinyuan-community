"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Calendar, FileText, Heart, Home, LayoutDashboard, Settings, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

export function DashboardSidebar() {
    const pathname = usePathname()

    const sidebarItems = [
        {
            title: "概览",
            href: "/dashboard",
            icon: LayoutDashboard,
            variant: "default"
        },
        {
            title: "入住服务",
            href: "/dashboard/accommodation",
            icon: Home,
            variant: "ghost"
        },
        {
            title: "活动管理",
            href: "/dashboard/activities",
            icon: Calendar,
            variant: "ghost"
        },
        {
            title: "审批中心",
            href: "/dashboard/approvals",
            icon: FileText,
            variant: "ghost"
        },
        {
            title: "志愿者",
            href: "/dashboard/volunteers",
            icon: Heart,
            variant: "ghost"
        },
        {
            title: "用户",
            href: "/dashboard/users",
            icon: Users,
            variant: "ghost"
        },
        {
            title: "系统设置",
            href: "/dashboard/settings",
            icon: Settings,
            variant: "ghost"
        }
    ]

    return (
        <div className="hidden border-r bg-slate-50/40 lg:block dark:bg-slate-800/40 w-64 min-h-screen">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Heart className="h-6 w-6 text-brand-green" />
                        <span className="">同心源工作台</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {sidebarItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 ${pathname === item.href ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50" : ""
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <div className="flex items-center gap-3 rounded-lg bg-slate-100 px-3 py-2">
                        <div className="h-8 w-8 rounded-full bg-brand-green/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-brand-green" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">社工小王</span>
                            <span className="text-xs text-slate-500">管理员</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
