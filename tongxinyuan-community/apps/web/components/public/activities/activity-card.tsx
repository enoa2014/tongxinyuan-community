"use client"

import { Activity } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, MapPin, Users, ExternalLink, QrCode } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { pb } from "@/lib/pocketbase"

const categoryMap: Record<string, string> = {
    festival: "节日活动",
    home_care: "居家照护",
    school_visit: "爱心入校",
    home_visit: "入户探访",
    training: "志愿者培训",
    other: "其他活动"
}

const statusMap: Record<string, { label: string, color: string }> = {
    planning: { label: "策划中", color: "bg-blue-100 text-blue-800" },
    recruiting: { label: "招募中", color: "bg-green-100 text-green-800" },
    ongoing: { label: "进行中", color: "bg-amber-100 text-amber-800" },
    review: { label: "复盘中", color: "bg-purple-100 text-purple-800" },
    completed: { label: "已归档", color: "bg-slate-100 text-slate-800" }
}

export function ActivityCard({ activity }: { activity: Activity }) {
    const isRecruiting = activity.status === "recruiting"

    // Determine button action
    const RegistrationButton = () => {
        if (!isRecruiting) {
            return (
                <Button variant="outline" disabled className="w-full">
                    {statusMap[activity.status]?.label || "活动结束"}
                </Button>
            )
        }

        if (activity.registration_type === "external" && activity.registration_url) {
            return (
                <Button className="w-full bg-brand-green hover:bg-brand-green/90" asChild>
                    <a href={activity.registration_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        立即报名
                    </a>
                </Button>
            )
        }

        if (activity.registration_type === "offline" || (activity.registration_type === "form" && activity.qrcode)) {
            // For offline (scan group QR) or form (scan form QR)
            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full bg-brand-green hover:bg-brand-green/90">
                            <QrCode className="mr-2 h-4 w-4" />
                            扫码报名
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>扫码参与活动</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center p-6 space-y-4">
                            {activity.qrcode ? (
                                <div className="relative w-64 h-64 border rounded-lg overflow-hidden">
                                    <img
                                        src={pb.files.getURL(activity, activity.qrcode)}
                                        alt="Registration QR Code"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div className="text-muted-foreground p-10 bg-slate-50 rounded-lg">
                                    暂无二维码，请联系工作人员
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground text-center">
                                请使用微信扫一扫<br />
                                {activity.registration_type === "form" ? "填写报名表" : "加入活动群"}
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>
            )
        }

        // Fallback for form type without QR code (maybe internal form later)
        return (
            <Button className="w-full" disabled>
                报名通道准备中
            </Button>
        )
    }

    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-slate-100 rounded-t-lg overflow-hidden">
                {activity.photos && activity.photos.length > 0 ? (
                    <img
                        src={pb.files.getURL(activity, activity.photos[0])}
                        alt={activity.title}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-300">
                        <Calendar className="h-12 w-12" />
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className={statusMap[activity.status]?.color}>
                        {statusMap[activity.status]?.label}
                    </Badge>
                </div>
                <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-white/90 text-slate-800 backdrop-blur-sm">
                        {categoryMap[activity.category]}
                    </Badge>
                </div>
            </div>

            <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">{activity.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {activity.start_time
                        ? format(new Date(activity.start_time), "yyyy年MM月dd日 HH:mm", { locale: zhCN })
                        : "时间待定"
                    }
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-2">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{activity.location || "地点待定"}</span>
                </div>
                {activity.summary && (
                    <p className="text-sm text-muted-foreground line-clamp-3 pt-2 border-t mt-2">
                        {activity.summary}
                    </p>
                )}
            </CardContent>

            <CardFooter className="pt-2">
                <RegistrationButton />
            </CardFooter>
        </Card>
    )
}
