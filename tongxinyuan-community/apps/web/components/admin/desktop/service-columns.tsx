"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CaseNotesResponse, ResidentsResponse, StaffResponse } from "@/types/pocketbase-types"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, FileText, Calendar } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the expanded type for CaseNotes
type CaseNoteExpanded = CaseNotesResponse<{
    resident: ResidentsResponse
    staff: StaffResponse
}>

export const columns: ColumnDef<CaseNoteExpanded>[] = [
    {
        accessorKey: "date",
        header: "服务日期",
        cell: ({ row }) => {
            const date = new Date(row.getValue("date"))
            return <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(date, "yyyy-MM-dd HH:mm", { locale: zhCN })}</span>
            </div>
        },
    },
    {
        accessorKey: "resident",
        header: "服务对象",
        cell: ({ row }) => {
            const resident = row.original.expand?.resident
            return resident ? (
                <div className="font-medium">{resident.name}</div>
            ) : (
                <span className="text-muted-foreground">未知</span>
            )
        }
    },
    {
        accessorKey: "type",
        header: "服务类型",
        cell: ({ row }) => {
            const type = row.getValue("type") as string
            return (
                <Badge variant="outline">{type}</Badge>
            )
        },
    },
    {
        accessorKey: "content",
        header: "记录内容",
        cell: ({ row }) => {
            const content = row.getValue("content") as string
            // Strip HTML tags for preview and truncate
            const preview = content?.replace(/<[^>]*>?/gm, "") || ""
            return (
                <div className="max-w-[300px] truncate text-muted-foreground" title={preview}>
                    {preview}
                </div>
            )
        },
    },
    {
        accessorKey: "staff",
        header: "记录社工",
        cell: ({ row }) => {
            const staff = row.original.expand?.staff
            return staff ? (
                <span>{staff.name || staff.email}</span>
            ) : (
                <span className="text-muted-foreground">-</span>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">打开菜单</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>操作</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            复制 ID
                        </DropdownMenuItem>
                        <DropdownMenuItem>查看详情</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
