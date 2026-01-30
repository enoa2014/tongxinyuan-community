
import { pb } from "@/lib/pocketbase"
import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Calendar } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { NewsActions } from "@/components/news/news-actions"

export const revalidate = 60

// Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const item = await pb.collection('news').getOne(id)
        return {
            title: `${item.title} - 同心源`,
            description: item.description || item.title,
        }
    } catch {
        return {
            title: "文章不存在 - 同心源"
        }
    }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let item

    try {
        item = await pb.collection('news').getOne(id)
        if (!item.published) {
            notFound()
        }
    } catch {
        notFound()
    }

    return (
        <article className="min-h-screen bg-white">
            {/* Header / Hero Section for the Article */}
            <div className="relative bg-slate-900 text-white py-24">
                <div className="absolute inset-0 overflow-hidden">
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-slate-900/80 z-10" />
                    {item.cover && (
                        <img
                            src={`/api/pb/api/files/${item.collectionId}/${item.id}/${item.cover}`}
                            alt={item.title}
                            className="w-full h-full object-cover blur-sm"
                        />
                    )}
                </div>

                <div className="container relative z-20 mx-auto px-4 max-w-4xl">
                    <div className="mb-8">
                        <Button asChild variant="outline" className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white backdrop-blur-sm group">
                            <Link href="/news">
                                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                返回列表
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-2">
                            <Badge className="bg-brand-green hover:bg-brand-green/90 border-0">
                                {({
                                    news: "新闻",
                                    story: "故事",
                                    notice: "公告",
                                    activity: "活动"
                                } as Record<string, string>)[item.category] || item.category}
                            </Badge>
                            {item.updated !== item.created && (
                                <Badge variant="outline" className="text-slate-300 border-white/20">已更新</Badge>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                            {item.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm md:text-base">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center border border-white/10">
                                    <User className="h-5 w-5 text-brand-green" />
                                </div>
                                <span>{item.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 opacity-70" />
                                <span>{format(new Date(item.created), "yyyy年MM月dd日", { locale: zhCN })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 max-w-4xl -mt-10 relative z-30">
                <div className="bg-white rounded-xl shadow-xl border p-8 md:p-12">

                    {/* Lead / Description */}
                    {item.description && (
                        <div className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed border-l-4 border-brand-green pl-6 mb-12 italic">
                            {item.description}
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="prose prose-lg prose-slate max-w-none 
                        prose-headings:font-bold prose-headings:text-slate-900 
                        prose-p:text-slate-700 prose-p:leading-loose
                        prose-a:text-brand-green prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:shadow-md">

                        {/* 
                           SAFEGUARD: In a real app, use a sanitizer like dompurify 
                           before rendering HTML from DB. For now, assuming trusted admin input.
                        */}
                        <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-16 pt-8 border-t flex items-center justify-between text-slate-500">
                        <div className="text-sm">
                            &copy; {new Date().getFullYear()} 同心源社区支持中心
                        </div>
                        <NewsActions title={item.title} />
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="h-24" />
        </article>
    )
}
