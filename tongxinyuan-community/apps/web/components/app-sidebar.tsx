import { Home, Users, FileText, Settings, LayoutDashboard, Database } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
} from "@/components/ui/sidebar"
import Link from "next/link"

const items = [
    {
        title: "仪表盘",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "居民管理",
        url: "/admin/residents",
        icon: Users,
    },
    {
        title: "服务记录",
        url: "/admin/case-notes", // TODO: Create this page
        icon: FileText,
    },
    {
        title: "草稿箱",
        url: "/admin/mobile/inbox", // Link to existing mobile inbox for now, or new desktop one
        icon: Database,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b">
                <h1 className="font-bold text-xl text-brand-main">同心源社区</h1>
                <p className="text-xs text-slate-500">管理后台</p>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>应用</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
