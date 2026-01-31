"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Activity } from "@/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Edit, MoreHorizontal, Trash } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { useRouter } from "next/navigation"
import { pb } from "@/lib/pocketbase"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

const ActivityActions = ({ activity, onRefresh }: { activity: Activity; onRefresh: () => void }) => {
    const router = useRouter()
    const { toast } = useToast()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        try {
            await pb.collection("activities").delete(activity.id)
            toast({ title: "已删除" })
            onRefresh()
            setOpen(false)
        } catch (e) {
            console.error(e)
            toast({ title: "删除失败", variant: "destructive", description: "请确保您有删除权限" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除?</AlertDialogTitle>
                        <AlertDialogDescription>
                            此操作无法撤销。这将永久删除活动 "{activity.title}" 及其所有归档数据。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault() // prevent auto-close
                                handleDelete()
                            }}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={loading}
                        >
                            {loading ? "删除中..." : "确认删除"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>操作</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/admin/activities/edit/${activity.id}`)}>
                        <Edit className="mr-2 h-4 w-4" /> 编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault()
                            setOpen(true)
                        }}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                        <Trash className="mr-2 h-4 w-4" /> 删除
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export const getColumns = (onRefresh: () => void): ColumnDef<Activity>[] => [
    {
        accessorKey: "title",
        header: "活动主题",
        cell: ({ row }) => <span className="font-medium">{row.getValue("title")}</span>,
    },
    {
        accessorKey: "category",
        header: "类型",
        cell: ({ row }) => {
            const category = row.getValue("category") as string
            const map: Record<string, string> = {
                home_care: "居家照护",
                festival: "节日活动",
                school_visit: "爱心入校",
                home_visit: "入户探访",
                training: "志愿者培训",
                other: "其他",
            }
            return <Badge variant="outline">{map[category] || category}</Badge>
        }
    },
    {
        accessorKey: "status",
        header: "状态",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const map: Record<string, { label: string, color: string }> = {
                planning: { label: "策划中", color: "bg-blue-100 text-blue-800" },
                recruiting: { label: "招募中", color: "bg-brand-green/20 text-brand-green" },
                ongoing: { label: "进行中", color: "bg-yellow-100 text-yellow-800" },
                review: { label: "复盘中", color: "bg-purple-100 text-purple-800" },
                completed: { label: "已归档", color: "bg-slate-100 text-slate-600" },
            }
            const config = map[status] || { label: status, color: "" }

            return (
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${config.color}`}>
                    {config.label}
                </div>
            )
        }
    },
    {
        accessorKey: "start_time",
        header: "开始时间",
        cell: ({ row }) => {
            const dateStr = row.getValue("start_time") as string
            if (!dateStr) return "-"
            const date = new Date(dateStr)
            return date.toLocaleDateString("zh-CN") + " " + date.toLocaleTimeString("zh-CN", { hour: '2-digit', minute: '2-digit' })
        }
    },
    {
        id: "lead_staff",
        header: "负责人",
        cell: ({ row }) => {
            const staff = row.original.expand?.lead_staff
            return staff ? staff.name : "-"
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <ActivityActions activity={row.original} onRefresh={onRefresh} />
    },
]
