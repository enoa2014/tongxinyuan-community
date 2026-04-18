
"use client"

import { format } from "date-fns"
import { Calendar, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityParticipationsResponse, ActivitiesResponse } from "@/types/pocketbase-types"
import { cn } from "@/lib/utils"

type ActivityParticipationWithActivity = ActivityParticipationsResponse<{
    activity?: ActivitiesResponse
}>

interface ActivityHistoryProps {
    items: ActivityParticipationWithActivity[]
}

export function ActivityHistory({ items }: ActivityHistoryProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
                暂无活动参与记录 No activity history found
            </div>
        )
    }

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case "enrolled":
                return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200"><Clock className="w-3 h-3 mr-1" /> 已报名 Enrolled</Badge>
            case "attended":
                return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200"><CheckCircle className="w-3 h-3 mr-1" /> 已参加 Attended</Badge>
            case "excused":
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"><AlertCircle className="w-3 h-3 mr-1" /> 请假 Excused</Badge>
            case "absent":
                return <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200"><XCircle className="w-3 h-3 mr-1" /> 缺席 Absent</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>参与历史 Participation History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map((item) => {
                        const activity = item.expand?.activity
                        if (!activity) return null

                        return (
                            <div key={item.id} className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-lg">{activity.title}</span>
                                        {getStatusBadge(item.status)}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                                        <span className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {activity.start_time ? format(new Date(activity.start_time), "yyyy-MM-dd HH:mm") : "TBD"}
                                        </span>
                                        <span className="flex items-center">
                                            Map Pin: {activity.location || "Online/TBD"}
                                        </span>
                                    </div>
                                    {item.feedback && (
                                        <div className="mt-2 text-sm bg-muted/50 p-2 rounded text-muted-foreground italic">
                                            "{item.feedback}"
                                        </div>
                                    )}
                                </div>
                                {item.rating && (
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-muted-foreground uppercase">Rating</span>
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={cn("text-lg", i < item.rating! ? "text-yellow-500" : "text-gray-300")}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
