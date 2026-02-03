"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Trash, Gift } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { pb } from "@/lib/pocketbase"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export type DonationRecord = {
    id: string
    donor_name: string
    project_name: string
    amount: string
    donate_date: string
    status: "published" | "draft" | "archived"
    description?: string
}

export const columns: ColumnDef<DonationRecord>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "donor_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    捐赠人
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="font-medium ml-4">{row.getValue("donor_name")}</div>
        ),
    },
    {
        accessorKey: "project_name",
        header: "捐赠项目",
        cell: ({ row }) => {
            return (
                <Badge variant="outline" className="font-normal text-slate-600">
                    {row.getValue("project_name")}
                </Badge>
            )
        },
    },
    {
        accessorKey: "amount",
        header: "金额/物资",
        cell: ({ row }) => {
            return (
                <div className="font-bold text-brand-green flex items-center gap-1">
                    <Gift className="h-3 w-3" />
                    {row.getValue("amount")}
                </div>
            )
        },
    },
    {
        accessorKey: "donate_date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    捐赠日期
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("donate_date"))
            return <div className="ml-4">{format(date, "yyyy-MM-dd", { locale: zhCN })}</div>
        },
    },
    {
        accessorKey: "status",
        header: "状态",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "published" ? "default" : "secondary"}>
                    {status === "published" ? "已公示" : status === "draft" ? "草稿" : "归档"}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DeleteAction record={row.original} />,
    },
]

function DeleteAction({ record }: { record: DonationRecord }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleDelete = async () => {
        try {
            setLoading(true)
            await pb.collection('public_donations').delete(record.id)
            toast({ title: "删除成功", description: "捐赠记录已删除" })
            setOpen(false)
            // Note: The page component subscribes to realtime updates, so list should auto-refresh
        } catch (error) {
            toast({ variant: "destructive", title: "删除失败", description: "请稍后重试" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600">
                    <Trash className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>确认删除？</AlertDialogTitle>
                    <AlertDialogDescription>
                        此操作无法撤销。这将永久删除捐赠人 "{record.donor_name}" 的捐赠记录。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {loading ? "删除中..." : "确认删除"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
