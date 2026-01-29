
"use client"

import { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { NewsArticle, getColumns } from "./columns"
import { DataTable } from "@/components/admin/data-table"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewsListPage() {
    const [data, setData] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            setLoading(true)
            const records = await pb.collection('news').getList(1, 50, {
                sort: '-created',
            });
            setData(records.items as unknown as NewsArticle[])
        } catch (error) {
            console.error("Failed to fetch news:", error)
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
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">内容管理</h2>
                    <p className="text-slate-500">发布和管理新闻、故事与公告。</p>
                </div>
                <Button asChild>
                    <Link href="/admin/news/create">
                        <Plus className="mr-2 h-4 w-4" />
                        写文章
                    </Link>
                </Button>
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
