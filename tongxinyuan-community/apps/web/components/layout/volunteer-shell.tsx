"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Heart, Calendar, Clock, Share2 } from "lucide-react"

export function VolunteerShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Nav items focused on Engagement
    const navItems = [
        { href: "/dashboard/volunteer", label: "广场", icon: Home },
        { href: "/dashboard/volunteer/events", label: "活动", icon: Calendar },
        { href: "/dashboard/volunteer/share", label: "分享", icon: Share2 },
        { href: "/dashboard/volunteer/history", label: "足迹", icon: Clock },
        { href: "/dashboard/volunteer/profile", label: "证书", icon: Heart },
    ]

    return (
        <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
            {/* Header with Gamification Stats */}
            <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between">
                <span className="font-bold text-lg text-rose-500">VolunHero</span>
                <div className="flex items-center gap-2 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                    <span className="text-xs font-bold text-amber-600">Lv.3</span>
                    <div className="w-16 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[60%]" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container max-w-lg mx-auto p-4 md:p-8">
                {children}
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden safe-area-bottom">
                <div className="flex h-16 items-center justify-around">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${pathname === item.href
                                    ? "text-rose-500"
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
