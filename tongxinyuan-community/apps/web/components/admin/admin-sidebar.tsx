
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { LayoutDashboard, Users, MessageSquareText, FileText, Settings, LogOut, Calendar, HeartHandshake } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { pb } from "@/lib/pocketbase"
import { useRouter } from "next/navigation"

const sidebarItems = [
    {
        title: "概览 (Dashboard)",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        roles: ['social_worker', 'web_admin', 'manager'],
    },
    {
        title: "志愿者管理",
        href: "/admin/volunteers",
        icon: Users,
        roles: ['social_worker', 'web_admin', 'manager'],
    },
    {
        title: "受助人档案",
        href: "/admin/beneficiaries",
        icon: HeartHandshake,
        roles: ['social_worker', 'web_admin', 'manager'],
    },
    {
        title: "服务咨询",
        href: "/admin/consultations",
        icon: MessageSquareText,
        roles: ['social_worker', 'manager'], // Admin excluded for privacy
    },
    {
        title: "服务项目管理",
        href: "/admin/services",
        icon: LayoutDashboard,
        roles: ['web_admin', 'manager'],
    },
    {
        title: "文章发布",
        href: "/admin/news",
        icon: FileText,
        roles: ['web_admin', 'manager'],
    },
    {
        title: "活动管理",
        href: "/admin/activities",
        icon: Calendar,
        roles: ['social_worker', 'web_admin', 'manager'],
    },
    {
        title: "系统设置",
        href: "/admin/settings",
        icon: Settings,
        roles: ['web_admin'],
    },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [userRole, setUserRole] = React.useState<string>((pb.authStore.model?.role as string) || '');
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Force refresh to get latest fields (e.g. role) if they were added after login
        // and to verify token validity.
        const refreshAuth = async () => {
            try {
                if (pb.authStore.isValid) {
                    await pb.collection('staff').authRefresh();
                    setUserRole((pb.authStore.model?.role as string) || '');
                }
            } catch (e) {
                console.error("Auth refresh failed", e);
            } finally {
                setIsLoading(false);
            }
        };
        refreshAuth();
    }, []);

    const handleLogout = () => {
        pb.authStore.clear()
        document.cookie = "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        router.push("/admin/login")
    }

    const filteredItems = sidebarItems.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(userRole);
    });

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-slate-900 text-slate-100">
            <div className="flex h-16 items-center border-b border-slate-800 px-6">
                <span className="text-lg font-bold text-brand-golden">同心源·管理后台</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-6 mb-4">
                    <div className="text-xs text-slate-500 uppercase font-semibold">
                        {userRole === 'social_worker' && '社工视图'}
                        {userRole === 'web_admin' && '管理员视图'}
                        {userRole === 'manager' && '管理者视图'}
                    </div>
                </div>
                <nav className="space-y-1 px-3">
                    {filteredItems.map((item) => (
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
                <div className="mb-2 px-2 text-xs text-slate-500 truncate">
                    {pb.authStore.model?.email}
                </div>
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
