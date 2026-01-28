
"use client"

import { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { ServiceConsultation, getColumns } from "./columns"
import { DataTable } from "@/components/admin/data-table"
import { Loader2 } from "lucide-react"

export default function ConsultationsPage() {
    const [data, setData] = useState<ServiceConsultation[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            setLoading(true)
            const records = await pb.collection('service_consultations').getList(1, 50, {
                sort: '-created',
            });
            setData(records.items as unknown as ServiceConsultation[])
        } catch (error) {
            console.error("Failed to fetch consultations:", error)
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
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">服务咨询</h2>
                    <p className="text-slate-500">管理来自患儿家庭和社会的求助与询问。</p>
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
