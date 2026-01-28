
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ServiceConsultation } from "@/app/admin/(protected)/consultations/columns"

interface ServiceDetailDialogProps {
    consultation: ServiceConsultation | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ServiceDetailDialog({
    consultation,
    open,
    onOpenChange,
}: ServiceDetailDialogProps) {
    if (!consultation) return null

    const typeMap: Record<string, string> = {
        "medical-support": "就医协助",
        "accommodation": "住宿咨询",
        "financial-aid": "经济援助",
        "psychological": "心理支持",
        "other": "其他事务"
    }

    const labelMap: Record<string, string> = {
        pending: "待处理",
        contacted: "已跟进",
        resolved: "已办结"
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        <DialogTitle className="text-xl">{consultation.name}</DialogTitle>
                        <Badge variant={
                            consultation.status === "resolved" ? "default" :
                                consultation.status === "pending" ? "destructive" : "secondary"
                        }>
                            {labelMap[consultation.status] || consultation.status}
                        </Badge>
                    </div>
                    <DialogDescription>
                        咨询ID: {consultation.id} • 提交时间: {new Date(consultation.created).toLocaleString("zh-CN")}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[50vh] pr-4">
                    <div className="space-y-6">
                        {/* 基本信息 */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg border-b pb-2">基本信息</h3>
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-slate-500">联系电话</dt>
                                    <dd className="font-medium text-lg">{consultation.phone}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">服务类型</dt>
                                    <dd className="font-medium">
                                        <Badge variant="outline">{typeMap[consultation.service_type] || consultation.service_type}</Badge>
                                    </dd>
                                </div>
                            </dl>
                        </section>

                        {/* 咨询详情 */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg border-b pb-2">咨询内容</h3>
                            <div className="bg-slate-50 p-4 rounded-md text-sm leading-relaxed whitespace-pre-wrap">
                                {consultation.description || "未填写"}
                            </div>
                        </section>

                        {/* 操作日志 */}
                        {consultation.history && consultation.history.length > 0 && (
                            <section className="space-y-3">
                                <h3 className="font-semibold text-lg border-b pb-2">操作日志</h3>
                                <div className="space-y-4 pl-2">
                                    {consultation.history.map((item: any, index: number) => (
                                        <div key={index} className="relative pl-6 border-l border-slate-200 pb-2 last:pb-0 last:border-0">
                                            <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                                            <div className="text-sm font-medium text-slate-900">{item.action}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">
                                                {new Date(item.date).toLocaleString("zh-CN")} • 操作人: {item.operator}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
