"use client"

import { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { News } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import Link from "next/link"

const categoryLabels: Record<string, string> = {
    news: "新闻动态",
    story_official: "暖心故事",
    story_volunteer: "志愿者说",
    media_report: "媒体报道",
    notice: "公告通知"
}

const categoryColors: Record<string, string> = {
    news: "bg-blue-100 text-blue-800",
    story_official: "bg-pink-100 text-pink-800",
    story_volunteer: "bg-orange-100 text-orange-800",
    media_report: "bg-purple-100 text-purple-800",
    notice: "bg-gray-100 text-gray-800"
}

export function StoryList() {
    const [stories, setStories] = useState<News[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentTab, setCurrentTab] = useState("all")

    useEffect(() => {
        const fetchStories = async () => {
            setIsLoading(true)
            try {
                let filter = 'published = true'

                if (currentTab === "news") {
                    filter += ' && (category = "news" || category = "media_report")'
                } else if (currentTab === "stories") {
                    filter += ' && (category = "story_official" || category = "story_volunteer")'
                } else if (currentTab === "notices") {
                    filter += ' && category = "notice"'
                }

                const result = await pb.collection("news").getList<News>(1, 50, {
                    filter: filter,
                    sort: '-created',
                    requestKey: null
                })
                setStories(result.items)
            } catch (error) {
                console.error("Failed to fetch stories:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStories()
    }, [currentTab])

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full sm:w-auto">
                    <TabsList>
                        <TabsTrigger value="all">全部内容</TabsTrigger>
                        <TabsTrigger value="news">新闻动态</TabsTrigger>
                        <TabsTrigger value="stories">暖心故事</TabsTrigger>
                        <TabsTrigger value="notices">公告通知</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : stories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((story) => (
                        <Link href={`/news/${story.id}`} key={story.id} className="block group">
                            <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:-translate-y-1">
                                <div className="relative h-48 bg-slate-100 overflow-hidden">
                                    {story.cover ? (
                                        <img
                                            src={pb.files.getURL(story, story.cover)}
                                            alt={story.title}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300 bg-slate-50">
                                            <span className="text-4xl">📄</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <Badge variant="secondary" className={categoryColors[story.category] || "bg-slate-100"}>
                                            {categoryLabels[story.category] || "其他"}
                                        </Badge>
                                    </div>
                                </div>

                                <CardHeader>
                                    <CardTitle className="line-clamp-2 group-hover:text-brand-green transition-colors">
                                        {story.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <p className="text-muted-foreground text-sm line-clamp-3">
                                        {story.description || "暂无简介..."}
                                    </p>
                                </CardContent>

                                <CardFooter className="border-t pt-4 text-xs text-muted-foreground flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {story.author || "同心源"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(story.created), "yyyy-MM-dd")}
                                        </span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-green" />
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground bg-slate-50 rounded-lg">
                    暂无相关内容
                </div>
            )}
        </div>
    )
}
