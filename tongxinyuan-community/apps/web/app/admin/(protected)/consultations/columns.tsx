
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceActions } from "@/components/admin/services/service-actions"

// Type definition matching our PocketBase schema
export type ServiceConsultation = {
    id: string
    name: string
    phone: string
    service_type: string
    description: string
    status: "pending" | "contacted" | "resolved"
    created: string
    history?: any[]
}

export const getColumns = (onRefresh: () => void): ColumnDef<ServiceConsultation>[] => [
    {
        accessorKey: "name",
        header: "咨询人",
    },
    {
        accessorKey: "phone",
        header: "联系电话",
    },
    {
        accessorKey: "service_type",
        header: "服务类型",
        cell: ({ row }) => {
            const type = row.getValue("service_type") as string
            // Map English keys to Chinese labels if needed, or use as is if stored in Chinese
            const typeMap: Record<string, string> = {
                "medical-support": "就医协助",
                "accommodation": "住宿咨询",
                "financial-aid": "经济援助",
                "psychological": "心理支持",
                "other": "其他事务"
            }
            return typeMap[type] || type
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    状态
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
            if (status === "resolved") variant = "default"
            if (status === "pending") variant = "destructive" // Urgent
            if (status === "contacted") variant = "secondary"

            const labelMap: Record<string, string> = {
                pending: "待处理",
                contacted: "已跟进",
                resolved: "已办结"
            }

            return <Badge variant={variant}>{labelMap[status] || status}</Badge>
        },
    },
    {
        accessorKey: "created",
        header: "提交时间",
        cell: ({ row }) => {
            const date = new Date(row.getValue("created"))
            return date.toLocaleDateString("zh-CN") + " " + date.toLocaleTimeString("zh-CN", { hour: '2-digit', minute: '2-digit' })
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const record = row.original
            return <ServiceActions consultation={record} onRefresh={onRefresh} />
        },
    },
]
