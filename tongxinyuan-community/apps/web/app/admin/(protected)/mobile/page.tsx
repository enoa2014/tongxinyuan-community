"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Camera, CheckSquare, QrCode, ClipboardList, MapPin } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { QuickCaptureFAB } from "@/components/admin/mobile/quick-capture-fab"

export default function MobileDashboardPage() {
    const today = new Date()

    return (
        <div className="space-y-6 pb-20">
            {/* 1. Header with Context */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">工作台</h1>
                    <p className="text-sm text-slate-500">
                        {format(today, "yyyy年MM月dd日 EEEE", { locale: zhCN })}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-brand-green">现场模式</div>
                    <div className="text-xs text-slate-400">天气晴 26°C</div>
                </div>
            </div>

            {/* 2. Quick Actions Grid */}
            <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">快捷操作</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex-col gap-2 border-dashed border-2 hover:border-brand-green hover:bg-brand-green/5" asChild>
                        <Link href="/admin/mobile/scan">
                            <QrCode className="h-8 w-8 text-brand-green" />
                            <span>扫码签到</span>
                        </Link>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2 border-dashed border-2 hover:border-brand-green hover:bg-brand-green/5">
                        <Camera className="h-8 w-8 text-blue-500" />
                        <span>拍照记录</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2 border-dashed border-2 hover:border-brand-green hover:bg-brand-green/5" asChild>
                        <Link href="/admin/mobile/inbox">
                            <CheckSquare className="h-8 w-8 text-orange-500" />
                            <span>快速记事/Inbox</span>
                        </Link>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2 border-dashed border-2 hover:border-brand-green hover:bg-brand-green/5">
                        <MapPin className="h-8 w-8 text-purple-500" />
                        <span>位置打卡</span>
                    </Button>
                </div>
            </section>

            {/* 3. Today's Feed / Tasks */}
            <section className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">今日日程</h2>

                {/* Active Event Card */}
                <Card className="border-l-4 border-l-brand-green shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-base font-bold text-slate-800">
                                🏥 医院探访：省人民医院
                            </CardTitle>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">进行中</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-slate-600 mb-3 space-y-1">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                <span>14:00 - 16:30</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClipboardList className="h-4 w-4" />
                                <span>已签到志愿者: 3/5</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" className="w-full bg-brand-green hover:bg-brand-green/90">进入活动</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Event */}
                <Card className="opacity-75">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-base font-bold text-slate-800">
                                📚 绘本阅读：社区中心
                            </CardTitle>
                            <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full font-medium">17:00</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500">负责人：王小明</p>
                    </CardContent>
                </Card>
            </section>

            {/* 4. Quick Capture FAB */}
            <QuickCaptureFAB />
        </div>
    )
}
