
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, MessageSquareText, FileText, Settings, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { pb } from "@/lib/pocketbase"
import { useRouter } from "next/navigation"

const sidebarItems = [
    {
        title: "概览 (Dashboard)",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "志愿者管理",
        href: "/admin/volunteers",
        icon: Users,
    },
    {
        title: "服务咨询",
        href: "/admin/consultations",
        icon: MessageSquareText,
    },
    {
        title: "服务项目管理",
        href: "/admin/services",
        icon: LayoutDashboard, // Reusing icon or better one if imported
    },
    {
        title: "文章发布",
        href: "/admin/news",
        icon: FileText,
    },
    {
        title: "系统设置",
        href: "/admin/settings",
        icon: Settings,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = () => {
        pb.authStore.clear()
        // Clear cookie manually if needed, or rely on middleware checking authStore state sync (which might be tricky)
        // Ideally we also clear the cookie.
        document.cookie = "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        router.push("/admin/login")
    }

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-slate-900 text-slate-100">
            <div className="flex h-16 items-center border-b border-slate-800 px-6">
                <span className="text-lg font-bold text-brand-golden">同心源·管理后台</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white",
                                pathname === item.href ? "bg-slate-800 text-brand-golden" : "text-slate-400"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-800">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                </Button>
            </div>
        </div>
    )
}
