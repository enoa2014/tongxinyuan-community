"use client"

import { useEffect, useState } from "react"
import { CaseNotesResponse, ResidentsResponse, StaffResponse } from "@/types/pocketbase-types"
import { pb } from "@/lib/pocketbase"
import { columns } from "@/components/admin/desktop/service-columns"
import { ServicesTable } from "@/components/admin/desktop/services-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Define the expanded type for CaseNotes
type CaseNoteExpanded = CaseNotesResponse<{
    resident: ResidentsResponse
    staff: StaffResponse
}>

export default function ServicesPage() {
    const [data, setData] = useState<CaseNoteExpanded[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            // Sort by date DESC client-side if server sort fails, but try server sort first if we think it works
            // Given previous residents issue, we'll avoid sort param for now or test it gently
            const result = await pb.collection('case_notes').getList<CaseNoteExpanded>(1, 100, {
                expand: 'resident,staff',
                // sort: '-date', // Commented out to avoid 400 error risk initially
            })
            // Manual sort locally
            const sortedItems = result.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            setData(sortedItems)
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
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">服务记录</h2>
                    <p className="text-muted-foreground">
                        查看和管理社工的上门探访、电话慰问等服务记录。
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => alert("Create Service functionality coming soon")}>
                        <Plus className="mr-2 h-4 w-4" /> 记录服务
                    </Button>
                </div>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <span className="text-muted-foreground">加载中...</span>
                </div>
            ) : (
                <ServicesTable columns={columns} data={data} />
            )}
        </div>
    )
}
