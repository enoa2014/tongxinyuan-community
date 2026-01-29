
import { pb } from "@/lib/pocketbase"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper"
import { ArrowRight, Calendar, User } from "lucide-react"

export const revalidate = 60 // Revalidate every minute

async function getNews() {
    try {
        const records = await pb.collection('news').getList(1, 50, {
            sort: '-created',
            filter: 'published = true',
        });
        return records.items;
    } catch (e) {
        console.error("Failed to fetch news:", e);
        return [];
    }
}

export default async function NewsPage() {
    const news = await getNews();

    return (
        <InnerPageWrapper
            title="新闻动态"
            subtitle="了解同心源的最新活动、感人故事和官方公告。"
            backgroundImage="/images/volunteer-hero.png" // Reuse volunteer hero for now
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                    <Link key={item.id} href={`/news/${item.id}`} className="group h-full">
                        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                                {item.cover ? (
                                    <img
                                        src={pb.files.getUrl(item, item.cover)}
                                        alt={item.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                        <span className="text-4xl font-light">News</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm shadow-sm">
                                        {{
                                            news: "新闻",
                                            story: "故事",
                                            notice: "公告",
                                            activity: "活动"
                                        }[item.category] || item.category}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="pb-2">
                                <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-brand-green transition-colors">
                                    {item.title}
                                </h3>
                            </CardHeader>

                            <CardContent className="flex-grow">
                                <p className="text-slate-500 line-clamp-3 text-sm">
                                    {item.description || "暂无简介"}
                                </p>
                            </CardContent>

                            <CardFooter className="pt-0 text-xs text-slate-400 flex items-center justify-between border-t p-4 mt-auto bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {item.author}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {format(new Date(item.created), "MMM d, yyyy", { locale: zhCN })}
                                    </span>
                                </div>
                                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-brand-green" />
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>

            {news.length === 0 && (
                <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-xl border border-dashed">
                    <p className="text-lg">暂无发布的内容</p>
                    <p className="text-sm">请稍后再来看看吧</p>
                </div>
            )}
        </InnerPageWrapper>
    )
}
