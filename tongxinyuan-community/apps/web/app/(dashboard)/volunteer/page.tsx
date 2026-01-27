"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"

export default function VolunteerDashboardPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">推荐活动</h2>

            {/* Event Card */}
            <Card className="overflow-hidden border-0 shadow-md">
                <div className="h-32 bg-slate-200 relative">
                    {/* Image Placeholder */}
                    <span className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">活动封面图</span>
                </div>
                <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">六一儿童节·病房探访</h3>
                    <div className="flex items-center text-sm text-slate-500 gap-2 mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>6月1日 14:00-16:00</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 gap-2 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>上海儿童医学中心</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex -space-x-2">
                            {/* Avatar Stack */}
                            <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white" />
                            <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white" />
                            <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[10px] font-bold">+42</div>
                        </div>
                        <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-6">立即报名</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
