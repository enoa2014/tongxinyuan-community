
import { notFound } from "next/navigation"
import { Calendar, ArrowLeft, Tag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper"
import { NEWS_ITEMS } from "@/lib/data/news"

interface NewsDetailPageProps {
    params: {
        id: string
    }
}

// Generate static params for SSG
export function generateStaticParams() {
    return NEWS_ITEMS.map((news) => ({
        id: news.id,
    }))
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
    const news = NEWS_ITEMS.find(n => n.id === params.id)

    if (!news) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/news">
                    <Button variant="ghost" className="mb-6 hover:bg-slate-200 text-slate-500">
                        <ArrowLeft className="mr-2 h-4 w-4" /> 返回资讯列表
                    </Button>
                </Link>

                <article className="bg-white rounded-xl shadow-sm p-8 md:p-12 overflow-hidden">
                    <header className="mb-10 text-center border-b border-slate-100 pb-10">
                        <div className="flex justify-center gap-2 mb-6">
                            <Badge variant="secondary" className="bg-brand-green/10 text-brand-green hover:bg-brand-green/20">
                                {news.category === 'agency' ? '机构动态' : news.category === 'media' ? '媒体报道' : '政策解读'}
                            </Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                            {news.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center text-slate-500 text-sm gap-6">
                            <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {news.publishedAt}
                            </span>
                            {news.author && (
                                <span>
                                    作者/来源: <span className="font-medium text-slate-700">{news.author}</span>
                                </span>
                            )}
                        </div>
                    </header>

                    <div
                        className="prose prose-slate max-w-none prose-lg
                    prose-headings:font-bold prose-headings:text-slate-800
                    prose-a:text-brand-green prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:shadow-md"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />

                    <footer className="mt-12 pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-slate-400" />
                            <div className="flex gap-2">
                                {news.tags?.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-slate-500 font-normal">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </footer>
                </article>
            </div>
        </div>
    )
}
