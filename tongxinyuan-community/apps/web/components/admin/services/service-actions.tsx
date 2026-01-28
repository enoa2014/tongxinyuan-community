
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileText, PhoneOutgoing, CheckCircle2 } from "lucide-react"
import { ServiceConsultation } from "@/app/admin/(protected)/consultations/columns"
import { useState } from "react"
import { ServiceDetailDialog } from "./service-detail-dialog"
import { pb } from "@/lib/pocketbase"
import { toast } from "@/components/ui/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ServiceActionsProps {
    consultation: ServiceConsultation
    onRefresh: () => void
}

export function ServiceActions({ consultation, onRefresh }: ServiceActionsProps) {
    const [detailOpen, setDetailOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [pendingAction, setPendingAction] = useState<"pending" | "contacted" | "resolved" | null>(null)

    const handleStatusUpdate = async (status: "pending" | "contacted" | "resolved") => {
        try {
            setLoading(true)

            const actionMap = {
                "pending": "重置为待处理",
                "contacted": "跟进中",
                "resolved": "已办结"
            }

            const historyEntry = {
                action: actionMap[status],
                date: new Date().toISOString(),
                operator: "Admin",
                prevStatus: consultation.status
            }

            const currentHistory = Array.isArray(consultation.history) ? consultation.history : []
            const newHistory = [...currentHistory, historyEntry]

            await pb.collection('service_consultations').update(consultation.id, {
                status: status,
                history: newHistory
            })

            toast({
                title: status === "resolved" ? "已标记为办结" : status === "contacted" ? "已标记为跟进中" : "已重置为待处理",
                className: status === "resolved" ? "bg-green-50 border-green-200" : status === "contacted" ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"
            })
            onRefresh()
        } catch (e: any) {
            toast({
                title: "操作失败",
                description: e.message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
            setConfirmOpen(false)
            setPendingAction(null)
        }
    }

    const triggerUpdate = (status: "pending" | "contacted" | "resolved") => {
        // Reverse Update logic:
        // Resolved -> Contacted/Pending (Confirm)
        // Contacted -> Pending (Confirm)

        const isReverse =
            (consultation.status === "resolved" && status !== "resolved") ||
            (consultation.status === "contacted" && status === "pending");

        if (isReverse) {
            setPendingAction(status)
            setConfirmOpen(true)
        } else {
            handleStatusUpdate(status)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>操作</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(consultation.phone)}
                    >
                        复制电话
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setDetailOpen(true)}>
                        <FileText className="mr-2 h-4 w-4" />
                        查看详情
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                        onClick={() => triggerUpdate("contacted")}
                        disabled={loading || consultation.status === "contacted"}
                    >
                        <PhoneOutgoing className="mr-2 h-4 w-4" />
                        标记为已跟进
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-brand-green focus:text-brand-green focus:bg-green-50"
                        onClick={() => triggerUpdate("resolved")}
                        disabled={loading || consultation.status === "resolved"}
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        标记为已办结
                    </DropdownMenuItem>

                    {/* Show Reset if not pending */}
                    {consultation.status !== "pending" && (
                        <DropdownMenuItem
                            className="text-slate-500 focus:text-slate-600 focus:bg-slate-50"
                            onClick={() => triggerUpdate("pending")}
                            disabled={loading}
                        >
                            <span className="ml-[22px]">重置为待处理</span>
                        </DropdownMenuItem>
                    )}

                </DropdownMenuContent>
            </DropdownMenu>

            <ServiceDetailDialog
                consultation={consultation}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认修改状态？</AlertDialogTitle>
                        <AlertDialogDescription>
                            当前状态为 <b>{consultation.status}</b>。
                            <br />
                            您确定要将其修改为 <b>{pendingAction}</b> 吗？
                            此操作将被记录在审计日志中。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => pendingAction && handleStatusUpdate(pendingAction)}>
                            确认修改
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
