
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Eye, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Type definition matching our PocketBase schema
export type NewsArticle = {
    id: string
    title: string
    slug: string
    description: string
    author: string
    category: "news" | "story" | "notice"
    published: boolean
    created: string
    updated: string
}

export const getColumns = (onRefresh: () => void): ColumnDef<NewsArticle>[] => [
    {
        accessorKey: "title",
        header: "标题",
        cell: ({ row }) => <span className="font-medium">{row.getValue("title")}</span>
    },
    {
        accessorKey: "category",
        header: "分类",
        cell: ({ row }) => {
            const category = row.getValue("category") as string
            const map: Record<string, string> = {
                news: "新闻动态",
                story: "感人故事",
                notice: "官方公告",
                activity: "活动招募"
            }
            return <Badge variant="outline">{map[category] || category}</Badge>
        }
    },
    {
        accessorKey: "author",
        header: "作者",
    },
    {
        accessorKey: "published",
        header: "状态",
        cell: ({ row }) => {
            const isPublished = row.getValue("published")
            return isPublished ?
                <Badge className="bg-green-600">已发布</Badge> :
                <Badge variant="secondary">草稿</Badge>
        }
    },
    {
        accessorKey: "created",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    创建时间
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("created"))
            return date.toLocaleDateString("zh-CN")
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const article = row.original

            return (
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/news/edit/${article.id}`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    {/* Delete action will be added later */}
                </div>
            )
        },
    },
]
