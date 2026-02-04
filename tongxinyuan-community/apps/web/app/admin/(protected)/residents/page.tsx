"use client"

import { useEffect, useState } from "react"
import { ResidentsResponse } from "@/types/pocketbase-types"
import { pb } from "@/lib/pocketbase"
import { columns } from "@/components/admin/desktop/columns"
import { ResidentsTable } from "@/components/admin/desktop/residents-table"
import { ResidentSheet } from "@/components/admin/desktop/resident-sheet"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ResidentsPage() {
    const [data, setData] = useState<ResidentsResponse[]>([])
    const [loading, setLoading] = useState(true)

    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        try {
            // Sort removed to avoid PB 400 error
            const result = await pb.collection('residents').getList<ResidentsResponse>(1, 100)
            setData(result.items)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">居民管理</h1>
                    <p className="text-slate-500">管理社区居民档案与服务记录</p>
                </div>
                <ResidentSheet
                    open={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    onSuccess={fetchData}
                >
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> 添加居民
                    </Button>
                </ResidentSheet>
            </div>

            {loading ? (
                <div className="text-center py-10">加载中...</div>
            ) : (
                <ResidentsTable columns={columns} data={data} />
            )}
        </div>
    )
}
