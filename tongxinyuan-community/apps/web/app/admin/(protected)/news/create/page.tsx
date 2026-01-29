
"use client"

import { NewsForm } from "@/components/admin/news/news-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateNewsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/news">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">发布新文章</h2>
                    <p className="text-slate-500">填写以下信息发布新的内容。</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <NewsForm />
            </div>
        </div>
    )
}
