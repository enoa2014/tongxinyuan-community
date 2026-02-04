"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pb } from "@/lib/pocketbase"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Users, FileText, ClipboardList, Activity } from "lucide-react"

interface DashboardStats {
    residentsCount: number
    draftsCount: number
    servicesCount: number
    serviceTrends: { name: string; total: number }[]
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        residentsCount: 0,
        draftsCount: 0,
        servicesCount: 0,
        serviceTrends: [],
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch counts using getList(1, 1) with generic totalItems retrieval
                // This is a lightweight way to count totals in PB without fetching all data
                const residents = await pb.collection("residents").getList(1, 1)
                const drafts = await pb.collection("drafts").getList(1, 1, {
                    filter: "status = 'pending'"
                })

                // Ensure services exist before fetching
                let servicesCount = 0
                let serviceTrends: { name: string; total: number }[] = []

                try {
                    // For trends, we might need more data. 
                    // Ideally PB supports aggregation, but here we'll fetch last 100 to approximate trends
                    const services = await pb.collection("case_notes").getList(1, 100)
                    servicesCount = services.totalItems

                    const typeCounts: Record<string, number> = {}
                    services.items.forEach(item => {
                        const type = (item.type || "其他") as string
                        typeCounts[type] = (typeCounts[type] || 0) + 1
                    })

                    serviceTrends = Object.keys(typeCounts).map(key => ({
                        name: key,
                        total: typeCounts[key]
                    }))
                } catch (e) {
                    console.log("Services collection might not have data or exist yet", e)
                }

                setStats({
                    residentsCount: residents.totalItems,
                    draftsCount: drafts.totalItems,
                    servicesCount: servicesCount,
                    serviceTrends: serviceTrends,
                })
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">仪表盘</h2>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">总居民数</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "-" : stats.residentsCount}</div>
                        <p className="text-xs text-muted-foreground">社区在册居民总数</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">待处理草稿</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "-" : stats.draftsCount}</div>
                        <p className="text-xs text-muted-foreground">来自移动端的待办事项</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">累计服务</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "-" : stats.servicesCount}</div>
                        <p className="text-xs text-muted-foreground">已记录的服务总次数</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">活跃度</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Good</div>
                        <p className="text-xs text-muted-foreground">系统运行状态正常</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>服务类型分布</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {loading ? (
                            <div className="flex h-[350px] items-center justify-center text-muted-foreground">加载中...</div>
                        ) : stats.serviceTrends.length > 0 ? (
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={stats.serviceTrends}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-[350px] items-center justify-center text-muted-foreground">暂无数据</div>
                        )}
                    </CardContent>
                </Card>

                {/* Placeholder for Recent Activity or Notifications */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>最近动态</CardTitle>
                        {/* <CardDescription>Latest system activities</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">系统升级完成</p>
                                    <p className="text-sm text-muted-foreground">
                                        刚刚
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">Phase 3</div>
                            </div>
                            {/* We can add real recent activities later */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
