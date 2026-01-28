
import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { NewsItem } from "@/lib/data/news"

interface NewsCardProps {
    news: NewsItem
}

export function NewsCard({ news }: NewsCardProps) {
    const categoryMap: Record<string, string> = {
        agency: "机构动态",
        media: "媒体报道",
        policy: "政策解读"
    }

    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-none shadow-sm overflow-hidden group">
            <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                {/* Fallback image logic or real image */}
                <div className={`w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500`}>
                    {/* If we had real images, we would use Next/Image here. For now, use a placeholder color block */}
                    <div className="bg-brand-green/10 w-full h-full flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-2xl font-serif text-brand-green/40">Tongxy News</span>
                    </div>
                </div>
                <div className="absolute top-2 right-2">
                    <Badge className="bg-white/90 text-slate-800 hover:bg-white backdrop-blur-sm shadow-sm">
                        {categoryMap[news.category]}
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-5 pb-2">
                <div className="flex items-center text-slate-400 text-xs mb-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    {news.publishedAt}
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-brand-green transition-colors line-clamp-2">
                    {news.title}
                </h3>
            </CardHeader>

            <CardContent className="p-5 pt-2 flex-grow">
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                    {news.summary}
                </p>
            </CardContent>

            <CardFooter className="p-5 pt-0">
                <Link href={`/news/${news.id}`} className="inline-flex items-center text-sm font-medium text-brand-green hover:underline decoration-2 underline-offset-4">
                    阅读详情 <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
            </CardFooter>
        </Card>
    )
}
