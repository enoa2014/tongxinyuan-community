
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Eye, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { pb } from "@/lib/pocketbase"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
        header: "状态 (显示/存档)",
        cell: ({ row }) => <PublishedToggle article={row.original} />
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
        cell: ({ row }) => <DeleteAction article={row.original} onRefresh={onRefresh} />
    },
]

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

function PublishedToggle({ article }: { article: NewsArticle }) {
    const [published, setPublished] = useState(article.published)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleToggle = async (checked: boolean) => {
        // Optimistic update
        setPublished(checked)
        setLoading(true)

        try {
            await pb.collection('news').update(article.id, {
                published: checked
            })
            toast({
                title: checked ? "已设为公开" : "已设为存档",
                description: checked ? "文章将在网站可见" : "文章仅在后台可见"
            })
        } catch (error) {
            // Revert on failure
            setPublished(!checked)
            toast({ variant: "destructive", title: "更新失败", description: "请稍后重试" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch
                checked={published}
                onCheckedChange={handleToggle}
                disabled={loading}
            />
            <Label className="text-xs text-muted-foreground">
                {published ? "显示" : "存档"}
            </Label>
        </div>
    )
}

function DeleteAction({ article, onRefresh }: { article: NewsArticle, onRefresh: () => void }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleDelete = async () => {
        try {
            setLoading(true)
            await pb.collection('news').delete(article.id)
            toast({ title: "删除成功", description: "文章已成功删除" })
            setOpen(false)
            onRefresh()
        } catch (error) {
            toast({ variant: "destructive", title: "删除失败", description: "请稍后重试" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
                <Link href={`/admin/news/edit/${article.id}`}>
                    <Edit className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                </Link>
            </Button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4 text-slate-500 hover:text-red-600" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除？</AlertDialogTitle>
                        <AlertDialogDescription>
                            此操作无法撤销。这将永久删除文章 "{article.title}"。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {loading ? "删除中..." : "确认删除"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
