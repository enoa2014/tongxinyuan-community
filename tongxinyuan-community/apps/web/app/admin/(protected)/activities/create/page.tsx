"use client"

import { useEffect, useState } from "react"
import { ActivityForm } from "@/components/admin/activity-form"
import { pb } from "@/lib/pocketbase"

export default function CreateActivityPage() {
    const [staffList, setStaffList] = useState<any[]>([])

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                // Fetch all staff for the dropdown
                const res = await pb.collection("staff").getList(1, 100, {
                    sort: "name,email"
                })
                setStaffList(res.items)
            } catch (e) {
                console.error("Failed to fetch staff list", e)
            }
        }
        fetchStaff()
    }, [])

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-medium">发起新活动</h3>
                <p className="text-sm text-muted-foreground">
                    填写活动基本信息，创建后可邀请志愿者参与。
                </p>
            </div>
            <ActivityForm staffList={staffList} />
        </div>
    )
}

