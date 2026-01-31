
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ActivityForm } from "@/components/admin/activity-form"
import { pb } from "@/lib/pocketbase"
import { Activity } from "@/types"

export default function EditActivityPage() {
    const params = useParams()
    const [activity, setActivity] = useState<Activity | undefined>()
    const [staffList, setStaffList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            const id = params.id as string
            if (!id) return

            try {
                // Fetch staff
                const staffRes = await pb.collection("staff").getList(1, 100, { sort: "name,email" })
                setStaffList(staffRes.items)

                // Fetch activity
                const record = await pb.collection("activities").getOne<Activity>(id)
                setActivity(record)
            } catch (e) {
                console.error("Failed to load activity", e)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [params.id])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!activity) {
        return <div>Activity not found</div>
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-medium">编辑活动</h3>
                <p className="text-sm text-muted-foreground">
                    修改活动信息。
                </p>
            </div>
            <ActivityForm initialData={activity} staffList={staffList} />
        </div>
    )
}
