"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ResidentsResponse } from "@/types/pocketbase-types"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { DeleteResidentDialog } from "@/components/admin/desktop/delete-resident-dialog"
import { ResidentSheet } from "./resident-sheet"

// Separate component for Actions to handle state
const ActionCell = ({ resident }: { resident: ResidentsResponse }) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditSheet, setShowEditSheet] = useState(false)

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
                        onClick={() => navigator.clipboard.writeText(resident.id)}
                    >
                        复制 ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/mobile/residents/${resident.id}`}>
                            查看详情 (Mobile View)
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowEditSheet(true)}>
                        编辑档案
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        删除居民
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteResidentDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                residentId={resident.id}
                residentName={resident.name}
                onSuccess={() => {
                    // Slight hack: force reload page or table refetch usually handled by parent.
                    // For now, simpler to just reload to clear state or depend on SWR if we used it.
                    // Ideally, we'd pass a refresh callback via table meta, but let's try just refetch via window for now
                    // or context. But since the Table doesn't auto-refresh, we can just reload.
                    window.location.reload()
                }}
            />

            <ResidentSheet
                resident={resident}
                open={showEditSheet}
                onOpenChange={setShowEditSheet}
                onSuccess={() => window.location.reload()}
            />
        </>
    )
}

export const columns: ColumnDef<ResidentsResponse>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    姓名
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "phone",
        header: "电话",
    },
    {
        accessorKey: "status",
        header: "状态",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "active" ? "default" : "secondary"}>
                    {status === "active" ? "活跃" : status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "address",
        header: "地址",
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell resident={row.original} />,
    },
]
