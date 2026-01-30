"use client"

import { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { ServiceConsultation, getColumns } from "./columns"
import { DataTable } from "@/components/admin/data-table"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function ConsultationsPage() {
    const [data, setData] = useState<ServiceConsultation[]>([])
    const [loading, setLoading] = useState(true)
    const [isMounted, setIsMounted] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)
            console.log("Fetching consultations...")
            const records = await pb.collection('service_consultations').getList(1, 50, {
                sort: '-created'
            });
            console.log("Fetched consultations:", records.totalItems)
            setData(records.items as unknown as ServiceConsultation[])
        } catch (error) {
            console.error("Failed to fetch consultations:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleBatchStatus = async (selected: ServiceConsultation[], status: string, label: string) => {
        if (!confirm(`确定要将选中的 ${selected.length} 条咨询标记为 ${label} 吗? ${status === 'delete' ? '此操作不可恢复！' : ''}`)) return

        try {
            if (status === 'delete') {
                await Promise.all(selected.map(item => pb.collection('service_consultations').delete(item.id)))
                toast({
                    title: "批量删除成功",
                    description: `已删除 ${selected.length} 条记录`,
                })
            } else {
                await Promise.all(selected.map(item => pb.collection('service_consultations').update(item.id, { status })))
                toast({
                    title: "批量操作成功",
                    description: `已更新 ${selected.length} 条记录的状态`,
                })
            }
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
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">服务咨询</h2>
                    <p className="text-slate-500">查看和管理来自家庭的服务需求与咨询。</p>
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
                    itemLabel="条咨询"
                    batchActions={[
                        { label: "批量已跟进", onClick: (rows) => handleBatchStatus(rows, 'contacted', '已跟进'), variant: "default" },
                        { label: "批量已解决", onClick: (rows) => handleBatchStatus(rows, 'resolved', '已解决'), variant: "outline" },
                        { label: "批量删除", onClick: (rows) => handleBatchStatus(rows, 'delete', '删除'), variant: "destructive" },
                    ]}
                />
            )}
        </div>
    )
}
