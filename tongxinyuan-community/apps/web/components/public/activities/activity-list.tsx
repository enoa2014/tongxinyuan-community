"use client"

import { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { Activity } from "@/types"
import { ActivityCard } from "./activity-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export function ActivityList() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentTab, setCurrentTab] = useState("all")

    useEffect(() => {
        const fetchActivities = async () => {
            setIsLoading(true)
            try {
                let filter = 'status != "planning"' // Don't show planning drafts
                if (currentTab === "ongoing") {
                    filter = 'status = "recruiting" || status = "ongoing"'
                } else if (currentTab === "history") {
                    filter = 'status = "completed" || status = "review"'
                }

                const result = await pb.collection("activities").getList<Activity>(1, 50, {
                    filter: filter,
                    sort: '-created',
                    requestKey: null
                })
                setActivities(result.items)
            } catch (error) {
                console.error("Failed to fetch activities:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchActivities()
    }, [currentTab])

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full sm:w-auto">
                    <TabsList>
                        <TabsTrigger value="all">全部活动</TabsTrigger>
                        <TabsTrigger value="ongoing">正在进行</TabsTrigger>
                        <TabsTrigger value="history">往期回顾</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : activities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground bg-slate-50 rounded-lg">
                    暂无相关活动
                </div>
            )}
        </div>
    )
}
