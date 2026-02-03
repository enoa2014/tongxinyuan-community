"use client"

import { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { columns, DonationRecord } from "./columns"
import { DataTable } from "@/components/admin/data-table"
import { Loader2, Plus, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DonationListPage() {
    const [data, setData] = useState<DonationRecord[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            setLoading(true)
            // Fetch up to 500 items for client-side pagination
            const records = await pb.collection('public_donations').getList(1, 500, {
                sort: '-donate_date',
            });
            setData(records.items as unknown as DonationRecord[])
        } catch (error) {
            console.error("Failed to fetch donations:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()

        // Subscribe to realtime updates
        pb.collection('public_donations').subscribe('*', function (e) {
            fetchData()
        });

        return () => {
            pb.collection('public_donations').unsubscribe('*');
        }
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Gift className="h-8 w-8 text-brand-golden" />
                        捐赠公示管理
                    </h2>
                    <p className="text-slate-500">管理所有社会捐赠记录，确保信息公开透明。</p>
                </div>
                <Button asChild className="bg-brand-golden hover:bg-brand-golden/90 text-white">
                    <Link href="/admin/donations/create">
                        <Plus className="mr-2 h-4 w-4" />
                        录入捐赠
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
                </div>
            ) : (
                <DataTable columns={columns} data={data} searchKey="donor_name" />
            )}
        </div>
    )
}
