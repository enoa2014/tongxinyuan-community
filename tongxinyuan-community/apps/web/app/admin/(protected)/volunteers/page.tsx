
"use client"

import { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { VolunteerApplication, getColumns } from "./columns"
import { DataTable } from "@/components/admin/data-table"
import { Loader2 } from "lucide-react"

export default function VolunteersPage() {
    const [data, setData] = useState<VolunteerApplication[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            setLoading(true)
            const records = await pb.collection('volunteer_applications').getList(1, 50, {
                sort: '-created',
            });
            setData(records.items as unknown as VolunteerApplication[])
        } catch (error) {
            console.error("Failed to fetch volunteers:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

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
                <DataTable columns={tableColumns} data={data} />
            )}
        </div>
    )
}
