
import { pb } from "@/lib/pocketbase"
import { NewsForm } from "@/components/admin/news/news-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// IMPORTANT: Next.js 15 params is async
export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    let newsItem = null

    try {
        // Fetch raw data - we need authentication usually, but admin pages are server components?
        // Wait, pb.collection(...).getOne() runs on server side here. 
        // We need to ensure we have admin privileges or public read access.
        // Assuming 'news' is publicly readable (listRule = ""), getting one is safe.
        newsItem = await pb.collection('news').getOne(id)
    } catch (e) {
        console.error("Failed to load news item:", e)
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/news">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">编辑文章</h2>
                    <p className="text-slate-500">修改文章内容、属性或发布状态。</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <NewsForm initialData={newsItem} isEdit={true} />
            </div>
        </div>
    )
}
