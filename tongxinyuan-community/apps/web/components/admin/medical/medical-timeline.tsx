
"use client"

import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { MedicalLogsResponse } from "@/types/pocketbase-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Stethoscope, User } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface MedicalTimelineProps {
    logs: MedicalLogsResponse[]
}

const getFileUrl = (record: MedicalLogsResponse, filename: string) => {
    return `${process.env.NEXT_PUBLIC_PB_URL}/api/files/${record.collectionId}/${record.id}/${filename}`
}

export function MedicalTimeline({ logs }: MedicalTimelineProps) {
    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                <Stethoscope className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>暂无医疗日志记录</p>
                <p className="text-sm">请点击右上角“添加记录”开始追踪</p>
            </div>
        )
    }

    // Sort by date desc
    const sortedLogs = [...logs].sort((a, b) => {
        return new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
    })

    // Group by Year-Month
    const groupedLogs = sortedLogs.reduce((acc, log) => {
        const date = new Date(log.date || "")
        const key = format(date, "yyyy年MM月", { locale: zhCN })
        if (!acc[key]) acc[key] = []
        acc[key].push(log)
        return acc
    }, {} as Record<string, MedicalLogsResponse[]>)

    return (
        <div className="space-y-8 relative pl-4 md:pl-0">
            {/* Timeline Line (Visual only for desktop) */}
            <div className="hidden md:block absolute left-[150px] top-4 bottom-4 w-px bg-border" />

            {Object.entries(groupedLogs).map(([month, monthLogs]) => (
                <div key={month} className="relative">
                    <div className="md:absolute md:left-0 md:w-[130px] md:text-right mb-4 md:mb-0">
                        <Badge variant="outline" className="text-base font-normal bg-background">
                            {month}
                        </Badge>
                    </div>

                    <div className="md:ml-[180px] space-y-6">
                        {monthLogs.map((log) => (
                            <TimelineItem key={log.id} log={log} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

function TimelineItem({ log }: { log: MedicalLogsResponse }) {
    // Process images: The type might be string (single) or string[] (multiple) or undefined?
    // Based on pocketbase-types.ts, it says `images?: string`.
    // But we set it to multiple in PB.
    // If it's multiple, the SDK usually returns an array of filenames.
    // However, the generated type says `string`. This is a known issue with typegen sometimes.
    // We'll treat it as `string | string[]` and normalize it.

    const images: string[] = Array.isArray(log.images)
        ? log.images
        : (typeof log.images === 'string' && log.images.length > 0 ? [log.images] : [])

    return (
        <Card className="relative hover:shadow-md transition-shadow">
            <div className="absolute -left-[39px] top-6 w-5 h-5 rounded-full border-4 border-background bg-primary hidden md:block" />
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            {log.hospital || "未记录医院"}
                            <Badge variant="secondary" className="font-normal text-xs">
                                {log.department}
                            </Badge>
                        </CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                            <span className="flex items-center gap-1">
                                <User className="h-3 w-3" /> {log.doctor || "主治医师未知"}
                            </span>
                            <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" /> Date: {log.date ? format(new Date(log.date), "yyyy-MM-dd") : "N/A"}
                            </span>
                        </div>
                    </div>
                    {log.cost && (
                        <div className="text-right">
                            <div className="text-lg font-bold text-red-600">
                                ¥{Number(log.cost).toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">自费金额</div>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {(log.diagnosis || log.treatment) && (
                        <div className="bg-muted/30 p-3 rounded-md space-y-2">
                            {log.diagnosis && (
                                <div>
                                    <span className="font-semibold text-sm">诊断:</span> {log.diagnosis}
                                </div>
                            )}
                            {log.treatment && (
                                <div>
                                    <span className="font-semibold text-sm">治疗:</span> {log.treatment}
                                </div>
                            )}
                        </div>
                    )}

                    {log.notes && (
                        <p className="text-sm text-muted-foreground">
                            {log.notes}
                        </p>
                    )}

                    {images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {images.map((img, idx) => (
                                <ImagePreview key={idx} url={getFileUrl(log, img)} />
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function ImagePreview({ url }: { url: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-md border hover:opacity-80">
                    <Image
                        src={url}
                        alt="Medical Record"
                        fill
                        className="object-cover"
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl w-full h-full max-h-[80vh] p-0 overflow-hidden bg-black/90 border-none">
                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        src={url}
                        alt="Medical Record Full"
                        width={1200}
                        height={800}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
