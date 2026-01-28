
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { VolunteerApplication } from "@/app/admin/(protected)/volunteers/columns"

interface VolunteerDetailDialogProps {
    volunteer: VolunteerApplication | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function VolunteerDetailDialog({
    volunteer,
    open,
    onOpenChange,
}: VolunteerDetailDialogProps) {
    if (!volunteer) return null

    const levelMap: Record<string, string> = {
        level1: "Level 1: 普适型 (关注陪伴)",
        level2: "Level 2: 技能型 (摄影/设计/医疗等)",
        level3: "Level 3: 专业型 (心理咨询/社工)",
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        <DialogTitle className="text-xl">{volunteer.name}</DialogTitle>
                        <Badge variant={
                            volunteer.status === "approved" ? "default" :
                                volunteer.status === "rejected" ? "destructive" : "secondary"
                        }>
                            {volunteer.status === "approved" ? "已通过" :
                                volunteer.status === "rejected" ? "已拒绝" : "待审核"}
                        </Badge>
                    </div>
                    <DialogDescription>
                        申请ID: {volunteer.id} • 提交时间: {new Date(volunteer.created).toLocaleString("zh-CN")}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-6">
                        {/* 基本信息 */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg border-b pb-2">基本信息</h3>
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-slate-500">联系电话</dt>
                                    <dd className="font-medium">{volunteer.phone}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">年龄</dt>
                                    <dd className="font-medium">{volunteer.skills?.age || volunteer.age || "-"}</dd>
                                </div>
                                <div className="col-span-2">
                                    <dt className="text-slate-500">电子邮箱</dt>
                                    <dd className="font-medium">{volunteer.email || "-"}</dd>
                                </div>
                            </dl>
                        </section>

                        {/* 技能信息 */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg border-b pb-2">技能与特长</h3>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-slate-500 text-sm">申请等级:</span>
                                    <div className="font-medium mt-1">
                                        {levelMap[volunteer.skills?.level] || volunteer.skills?.level || "未选择"}
                                    </div>
                                </div>
                                {volunteer.skills?.skills && (
                                    <div>
                                        <span className="text-slate-500 text-sm">具体技能:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {Array.isArray(volunteer.skills.skills)
                                                ? volunteer.skills.skills.map((s: string) => <Badge key={s} variant="outline">{s}</Badge>)
                                                : <span className="text-sm">{String(volunteer.skills.skills)}</span>
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 申请动机 */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg border-b pb-2">申请动机</h3>
                            <div className="bg-slate-50 p-4 rounded-md text-sm leading-relaxed whitespace-pre-wrap">
                                {volunteer.motivation || "未填写"}
                            </div>
                        </section>

                        {/* 操作日志 */}
                        {volunteer.history && volunteer.history.length > 0 && (
                            <section className="space-y-3">
                                <h3 className="font-semibold text-lg border-b pb-2">操作日志</h3>
                                <div className="space-y-4 pl-2">
                                    {volunteer.history.map((item: any, index: number) => (
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
