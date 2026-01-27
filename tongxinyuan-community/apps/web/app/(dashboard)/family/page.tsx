"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Activity } from "lucide-react"

export default function FamilyDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Status Card */}
            <Card className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-0 shadow-lg shadow-teal-500/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium opacity-90">当前入住状态</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold mb-1">审核中</div>
                    <p className="text-teal-100 text-sm">已提交申请，预计2小时内审核</p>
                    <div className="mt-4 flex gap-2">
                        <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                            <Activity className="mr-2 h-4 w-4" />
                            查看进度
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-2 border-dashed border-2 hover:border-teal-500 hover:text-teal-600">
                    <PlusCircle className="h-6 w-6" />
                    预约厨房
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 border-dashed border-2 hover:border-teal-500 hover:text-teal-600">
                    <PlusCircle className="h-6 w-6" />
                    补充材料
                </Button>
            </div>
        </div>
    )
}
