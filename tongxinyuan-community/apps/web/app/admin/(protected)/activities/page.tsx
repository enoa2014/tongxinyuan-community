
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { pb } from "@/lib/pocketbase"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/data-table"
import { getColumns } from "./columns"
import { Activity } from "@/types"

export default function ActivitiesPage() {
    const router = useRouter()
    const [data, setData] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")

    const fetchData = async () => {
        setLoading(true)
        try {
            const filters = []
            if (statusFilter !== "all") filters.push(`status = "${statusFilter}"`)
            if (categoryFilter !== "all") filters.push(`category = "${categoryFilter}"`)

            const filterString = filters.length > 0 ? filters.join(" && ") : ""

            const records = await pb.collection("activities").getList<Activity>(1, 50, {
                sort: "-created",
                expand: "lead_staff",
                filter: filterString
            })
            setData(records.items)
        } catch (error) {
            console.error("Failed to fetch activities:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [statusFilter, categoryFilter]) // Re-fetch on filter change

    const handleCreate = () => {
        router.push("/admin/activities/create")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">活动管理</h2>
                    <p className="text-muted-foreground">
                        发起、管理和复盘公益活动
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleCreate} className="bg-brand-green hover:bg-brand-green/90">
                        <Plus className="mr-2 h-4 w-4" />
                        发起新活动
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">状态:</span>
                    <select
                        className="text-sm border rounded px-2 py-1"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">全部</option>
                        <option value="planning">策划中</option>
                        <option value="recruiting">招募中</option>
                        <option value="ongoing">进行中</option>
                        <option value="review">复盘中</option>
                        <option value="completed">已归档</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">类型:</span>
                    <select
                        className="text-sm border rounded px-2 py-1"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">全部</option>
                        <option value="festival">节日活动</option>
                        <option value="home_care">居家照护</option>
                        <option value="school_visit">爱心入校</option>
                        <option value="home_visit">入户探访</option>
                        <option value="training">志愿者培训</option>
                        <option value="other">其他</option>
                    </select>
                </div>
            </div>

            <DataTable
                columns={getColumns(() => fetchData())}
                data={data}
                searchKey="title"
                searchPlaceholder="搜索活动标题..."
            />
        </div>
    )
}
// Note: SelectItem artifact in JSX above is a typo in my string, fixing...

