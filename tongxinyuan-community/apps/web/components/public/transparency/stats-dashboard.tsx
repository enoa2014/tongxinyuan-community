"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Heart, Calendar, Clock } from "lucide-react"
import { pb } from "@/lib/pocketbase"

interface Stats {
    totalDonations: number
    totalBeneficiaries: number
    totalActivities: number
    totalVolunteerHours: number
}

export function StatsDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalDonations: 0,
        totalBeneficiaries: 0,
        totalActivities: 0,
        totalVolunteerHours: 0
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Total Donations (Count from public_donations)
                // For a real total amount, we'd need to sum up 'amount' field if it's numeric, 
                // but since it's a string "¥5000 or 50 sets", we might just count *donations* or try to parse.
                // For now, let's just count the *number of donation records*.
                const donations = await pb.collection("public_donations").getList(1, 1, {
                    filter: 'status = "published"',
                    requestKey: null
                })

                // 2. Total Beneficiaries
                const beneficiaries = await pb.collection("beneficiaries").getList(1, 1, {
                    requestKey: null
                })

                // 3. Total Activities (Completed)
                const activities = await pb.collection("activities").getList(1, 1, {
                    filter: 'status = "completed"',
                    requestKey: null
                })

                setStats({
                    totalDonations: donations.totalItems,
                    totalBeneficiaries: beneficiaries.totalItems,
                    totalActivities: activities.totalItems,
                    totalVolunteerHours: 1250 // Placeholder: Ideally this comes from a 'volunteer_logs' collection
                })
            } catch (error) {
                console.error("Failed to fetch stats:", error)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">累计捐赠人次</CardTitle>
                    <Heart className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalDonations}</div>
                    <p className="text-xs text-muted-foreground">
                        感谢每一份爱心
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">累计服务患儿</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalBeneficiaries}</div>
                    <p className="text-xs text-muted-foreground">
                        个家庭获得帮助
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">举办活动</CardTitle>
                    <Calendar className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalActivities}</div>
                    <p className="text-xs text-muted-foreground">
                        场公益关爱行动
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">志愿服务时长</CardTitle>
                    <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalVolunteerHours}+</div>
                    <p className="text-xs text-muted-foreground">
                        小时爱心奉献
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
