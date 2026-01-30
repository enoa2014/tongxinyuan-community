
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquareText, FileText, Activity, Loader2 } from "lucide-react"
import { pb } from "@/lib/pocketbase"

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        volunteers: 0,
        services: 0,
        news: 0,
        loading: true
    })

    useEffect(() => {
        async function fetchStats() {
            try {
                // Run in parallel
                const [volunteers, services, news] = await Promise.all([
                    pb.collection('volunteer_applications').getList(1, 1),
                    pb.collection('services').getList(1, 1),
                    pb.collection('news').getList(1, 1),
                ])

                setStats({
                    volunteers: volunteers.totalItems,
                    services: services.totalItems,
                    news: news.totalItems,
                    loading: false
                })
            } catch (e) {
                console.error("Failed to fetch dashboard stats", e)
                setStats(prev => ({ ...prev, loading: false }))
            }
        }

        fetchStats()
    }, [])

    if (stats.loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">志愿者申请</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.volunteers}</div>
                        <p className="text-xs text-muted-foreground">Total applications</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">服务项目</CardTitle>
                        <MessageSquareText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.services}</div>
                        <p className="text-xs text-muted-foreground">Active services</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">已发布文章</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.news}</div>
                        <p className="text-xs text-muted-foreground">News & Stories</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">系统状态</CardTitle>
                        <Activity className="h-4 w-4 text-brand-green" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-brand-green">Healthy</div>
                        <p className="text-xs text-muted-foreground">PocketBase Connected</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>近期动态</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">图表组件即将上线...</p>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>待办事项</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">审核队列空闲。</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
