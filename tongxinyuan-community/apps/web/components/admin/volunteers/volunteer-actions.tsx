
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileText, CheckCircle, XCircle } from "lucide-react"
import { VolunteerApplication } from "@/app/admin/(protected)/volunteers/columns"
import { useState } from "react"
import { VolunteerDetailDialog } from "./volunteer-detail-dialog"
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

interface VolunteerActionsProps {
    volunteer: VolunteerApplication
    onRefresh: () => void
}

export function VolunteerActions({ volunteer, onRefresh }: VolunteerActionsProps) {
    const [detailOpen, setDetailOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [pendingAction, setPendingAction] = useState<"approved" | "rejected" | "pending" | "delete" | null>(null)

    const handleStatusUpdate = async (status: "approved" | "rejected" | "pending") => {
        try {
            setLoading(true)

            // Build history entry
            const historyEntry = {
                action: status === "approved" ? "通过申请" : status === "rejected" ? "拒绝申请" : "重置为待审核",
                date: new Date().toISOString(),
                operator: "Admin",
                prevStatus: volunteer.status
            }

            const currentHistory = Array.isArray(volunteer.history) ? volunteer.history : []
            const newHistory = [...currentHistory, historyEntry]

            await pb.collection('volunteer_applications').update(volunteer.id, {
                status: status,
                history: newHistory
            })

            toast({
                title: status === "approved" ? "已通过申请" : status === "rejected" ? "已拒绝申请" : "已重置为待审核",
                className: status === "approved" ? "bg-green-50 border-green-200" : status === "rejected" ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"
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

    const triggerUpdate = (status: "approved" | "rejected" | "pending") => {
        // Reverse Update check: Approved -> Rejected/Pending OR Rejected -> Approved/Pending
        const isReverse =
            (volunteer.status === "approved" && (status === "rejected" || status === "pending")) ||
            (volunteer.status === "rejected" && (status === "approved" || status === "pending"));

        // Also confirm if resetting from Approved/Rejected to Pending
        const isReset = volunteer.status !== "pending" && status === "pending";

        if (isReverse || isReset) {
            setPendingAction(status)
            setConfirmOpen(true)
        } else {
            handleStatusUpdate(status)
        }
    }

    const triggerDelete = () => {
        setPendingAction("delete")
        setConfirmOpen(true)
    }

    const handleDelete = async () => {
        try {
            setLoading(true)
            await pb.collection('volunteer_applications').delete(volunteer.id)
            toast({
                title: "已删除记录",
                description: "该志愿者申请已永久删除",
            })
            onRefresh()
        } catch (e: any) {
            toast({
                title: "删除失败",
                description: e.message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
            setConfirmOpen(false)
            setPendingAction(null)
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
                        onClick={() => navigator.clipboard.writeText(volunteer.phone)}
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
                        className="text-brand-green focus:text-brand-green focus:bg-green-50"
                        onClick={() => triggerUpdate("approved")}
                        disabled={loading || volunteer.status === "approved"}
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        通过申请
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => triggerUpdate("rejected")}
                        disabled={loading || volunteer.status === "rejected"}
                    >
                        <XCircle className="mr-2 h-4 w-4" />
                        拒绝申请
                    </DropdownMenuItem>

                    {volunteer.status !== "pending" && (
                        <DropdownMenuItem
                            className="text-slate-500 focus:text-slate-600 focus:bg-slate-50"
                            onClick={() => triggerUpdate("pending")}
                            disabled={loading}
                        >
                            <span className="ml-[22px]">重置为待审核</span>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={triggerDelete}
                        disabled={loading}
                    >
                        <span className="ml-[22px]">删除记录</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <VolunteerDetailDialog
                volunteer={volunteer}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{pendingAction === "delete" ? "确认删除记录？" : "确认修改状态？"}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingAction === "delete" ? (
                                <span className="text-red-600 font-bold">此操作无法撤销。该志愿者申请将被永久删除。</span>
                            ) : (
                                <>
                                    当前状态为 <b>{volunteer.status === "approved" ? "已通过" : volunteer.status === "rejected" ? "已拒绝" : "待审核"}</b>。
                                    <br />
                                    您确定要将其修改为 <b>{pendingAction === "approved" ? "已通过" : pendingAction === "rejected" ? "已拒绝" : "待审核"}</b> 吗？
                                    此操作将被记录在审计日志中。
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (pendingAction === 'delete') {
                                    handleDelete()
                                } else if (pendingAction) {
                                    handleStatusUpdate(pendingAction)
                                }
                            }}
                            className={pendingAction === 'delete' ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                            {pendingAction === 'delete' ? "确认删除" : "确认修改"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
