
"use client"

import { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { VolunteerApplication, getColumns } from "./columns"
import { DataTable } from "@/components/admin/data-table"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function VolunteersPage() {
    const [data, setData] = useState<VolunteerApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [isMounted, setIsMounted] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)
            console.log("Fetching volunteers...", pb.authStore.model)
            console.log("Token:", pb.authStore.token ? `Present (${pb.authStore.token.length} chars)` : "Missing")
            const records = await pb.collection('volunteer_applications').getList(1, 50);
            console.log("Fetched volunteers:", records)
            setData(records.items as unknown as VolunteerApplication[])
        } catch (error) {
            console.error("Failed to fetch volunteers:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleBatchAction = async (selected: VolunteerApplication[], action: string) => {
        const actionLabel = action === 'delete' ? '删除' : action === 'approved' ? '通过' : '拒绝';
        if (!confirm(`确定要${actionLabel}选中的 ${selected.length} 位志愿者吗? ${action === 'delete' ? '此操作不可恢复！' : ''}`)) return

        try {
            if (action === 'delete') {
                await Promise.all(selected.map(v => pb.collection('volunteer_applications').delete(v.id)))
            } else {
                await Promise.all(selected.map(v => pb.collection('volunteer_applications').update(v.id, { status: action })))
            }

            toast({
                title: "批量操作成功",
                description: `已${actionLabel} ${selected.length} 条记录`,
            })
            fetchData()
        } catch (error) {
            toast({
                title: "操作失败",
                description: "部分记录可能未更新成功",
                variant: "destructive"
            })
        }
    }

    useEffect(() => {
        setIsMounted(true)
        fetchData()
    }, [])

    if (!isMounted) {
        return null
    }

    const tableColumns = getColumns(fetchData)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">志愿者管理</h2>
                    <p className="text-slate-500">查看和管理所有的志愿者加入申请。</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
                </div>
            ) : (
                <DataTable
                    columns={tableColumns}
                    data={data}
                    itemLabel="位志愿者"
                    batchActions={[
                        { label: "批量通过", onClick: (rows) => handleBatchAction(rows, 'approved'), variant: "default" },
                        { label: "批量拒绝", onClick: (rows) => handleBatchAction(rows, 'rejected'), variant: "destructive" },
                        { label: "批量删除", onClick: (rows) => handleBatchAction(rows, 'delete'), variant: "destructive" },
                    ]}
                />
            )}
        </div>
    )
}
