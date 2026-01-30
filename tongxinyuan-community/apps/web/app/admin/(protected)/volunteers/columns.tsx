
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VolunteerActions } from "@/components/admin/volunteers/volunteer-actions"
import { Checkbox } from "@/components/ui/checkbox"

// Type definition matching our PocketBase schema
export type VolunteerApplication = {
    id: string
    name: string
    phone: string
    skills: any // JSON
    motivation: string
    status: "pending" | "approved" | "rejected"
    created: string
    age?: number
    email?: string
    history?: any[]
}

export const getColumns = (onRefresh: () => void): ColumnDef<VolunteerApplication>[] => [
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
        header: "联系电话",
    },
    {
        accessorKey: "skills.level",
        header: "技能等级",
        cell: ({ row }) => {
            let skills = row.original.skills
            // Handle if skills is string (JSON string)
            if (typeof skills === 'string') {
                try {
                    skills = JSON.parse(skills)
                } catch (e) {
                    skills = {}
                }
            }
            const level = skills?.level
            const levelMap: Record<string, string> = {
                level1: "Level 1: 普适型",
                level2: "Level 2: 技能型",
                level3: "Level 3: 专业型",
            }
            return levelMap[level] || level || "-"
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
            if (status === "approved") variant = "default" // Greenish in our theme usually
            if (status === "rejected") variant = "destructive"
            if (status === "pending") variant = "secondary"

            const labelMap: Record<string, string> = {
                pending: "待审核",
                approved: "已通过",
                rejected: "已拒绝"
            }

            return <Badge variant={variant}>{labelMap[status] || status}</Badge>
        },
    },
    {
        accessorKey: "created",
        header: "申请时间",
        cell: ({ row }) => {
            const date = new Date(row.getValue("created"))
            return date.toLocaleDateString("zh-CN") + " " + date.toLocaleTimeString("zh-CN", { hour: '2-digit', minute: '2-digit' })
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const volunteer = row.original
            return <VolunteerActions volunteer={volunteer} onRefresh={onRefresh} />
        },
    },
]
