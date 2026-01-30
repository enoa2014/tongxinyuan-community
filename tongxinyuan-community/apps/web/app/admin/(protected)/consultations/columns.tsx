"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { MoreHorizontal, Check, Edit2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { pb } from "@/lib/pocketbase"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"

export type ServiceConsultation = {
    id: string
    name: string
    phone: string
    service_type: string
    description: string
    status: "pending" | "contacted" | "resolved"
    created: string
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" }> = {
    pending: { label: "待处理", variant: "secondary" }, // Yellow-ish usually or gray
    contacted: { label: "已跟进", variant: "default" },    // Blue
    resolved: { label: "已解决", variant: "success" },   // Green
}

const ServiceActions = ({ consultation, refreshData }: { consultation: ServiceConsultation; refreshData: () => void }) => {
    const router = useRouter()

    const updateStatus = async (newStatus: string) => {
        try {
            await pb.collection('service_consultations').update(consultation.id, {
                status: newStatus
            })
            toast({
                title: "状态已更新",
                description: `咨询状态已标记为${statusMap[newStatus].label}`,
            })
            refreshData()
            router.refresh()
        } catch (error) {
            toast({
                title: "更新失败",
                description: "请重试或联系管理员",
                variant: "destructive"
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>操作</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateStatus('contacted')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    标记为已跟进
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus('resolved')}>
                    <Check className="mr-2 h-4 w-4" />
                    标记为已解决
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        if (confirm('确认删除此咨询记录？此操作不可恢复。')) {
                            pb.collection('service_consultations').delete(consultation.id)
                                .then(() => {
                                    toast({ title: "已删除" })
                                    refreshData()
                                    router.refresh()
                                })
                        }
                    }}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                    <Check className="mr-2 h-4 w-4" />
                    删除记录
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const getColumns = (refreshData: () => void): ColumnDef<ServiceConsultation>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "姓名",
    },
    {
        accessorKey: "phone",
        header: "电话",
    },
    {
        accessorKey: "service_type",
        header: "咨询类型",
        cell: ({ row }) => {
            const type = row.getValue("service_type") as string
            // Map common types or just display
            return <span className="capitalize">{type}</span>
        }
    },
    {
        accessorKey: "description",
        header: "需求描述",
        cell: ({ row }) => {
            const desc = row.getValue("description") as string
            return (
                <div className="max-w-[200px] truncate" title={desc}>
                    {desc}
                </div>
            )
        }
    },
    {
        accessorKey: "status",
        header: "状态",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const config = statusMap[status] || { label: status, variant: "outline" }
            return (
                // @ts-ignore - variant success might be custom, fallback to outline if needed
                <Badge variant={config.variant === 'success' ? 'default' : config.variant} className={config.variant === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}>
                    {config.label}
                </Badge>
            )
        },
    },
    {
        accessorKey: "created",
        header: "提交时间",
        cell: ({ row }) => {
            return format(new Date(row.getValue("created")), "yyyy-MM-dd HH:mm")
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return <ServiceActions consultation={row.original} refreshData={refreshData} />
        },
    },
]
