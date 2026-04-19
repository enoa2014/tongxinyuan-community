"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { pb } from "@/lib/pocketbase"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { NewsResponse } from "@/types/pocketbase-types"

const RichTextEditor = dynamic(
    () => import("./rich-text-editor").then((mod) => mod.RichTextEditor),
    { ssr: false, loading: () => <p>Loading editor...</p> }
)

const newsFormSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters")
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    description: z.string().max(200, "Summary must be at most 200 characters"),
    author: z.string().min(1, "Author is required"),
    category: z.enum(["news", "story", "notice", "activity"]),
    content: z.string().min(10, "Content is too short"),
    published: z.boolean(),
})

type NewsFormValues = z.infer<typeof newsFormSchema>

interface NewsFormProps {
    initialData?: NewsResponse | null
    isEdit?: boolean
}

type PocketBaseErrorLike = {
    data?: {
        message?: string
    }
}

function getPocketBaseErrorMessage(error: unknown) {
    if (typeof error === "object" && error !== null && "data" in error) {
        return (error as PocketBaseErrorLike).data?.message
    }

    return undefined
}

export function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [coverFile, setCoverFile] = useState<File | null>(null)

    const form = useForm<NewsFormValues>({
        resolver: zodResolver(newsFormSchema),
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            description: initialData?.description || "",
            author: initialData?.author || "同心苑",
            category: initialData?.category || "news",
            content: initialData?.content || "",
            published: initialData?.published || false,
        },
    })

    async function onSubmit(data: NewsFormValues) {
        setIsLoading(true)
        try {
            const formData = new FormData()

            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value.toString())
            })

            if (coverFile) {
                formData.append("cover", coverFile)
            }

            if (isEdit && initialData?.id) {
                await pb.collection("news").update(initialData.id, formData)
                toast({ title: "更新成功", description: "文章已更新。" })
            } else {
                await pb.collection("news").create(formData)
                toast({ title: "发布成功", description: "文章已创建。" })
            }

            router.push("/admin/news")
            router.refresh()
        } catch (error: unknown) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "操作失败",
                description: getPocketBaseErrorMessage(error) || "请检查网络连接或表单字段。",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>标题</FormLabel>
                                <FormControl>
                                    <Input placeholder="输入文章标题..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="english-slug-only" {...field} />
                                </FormControl>
                                <FormDescription>用于生成文章链接，仅支持小写字母、数字和连字符。</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>作者</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>分类</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="选择分类" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="news">新闻动态</SelectItem>
                                        <SelectItem value="story">感人故事</SelectItem>
                                        <SelectItem value="notice">官方公告</SelectItem>
                                        <SelectItem value="activity">活动招募</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>摘要</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="一句话概括这篇文章..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>封面图片</FormLabel>
                    <FormControl>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
                        />
                    </FormControl>
                    <FormDescription>
                        {initialData?.cover ? `当前封面: ${initialData.cover}` : "可选，建议上传不超过 5MB 的图片。"}
                    </FormDescription>
                </FormItem>

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>正文</FormLabel>
                            <FormControl>
                                <RichTextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="在这里编写文章内容..."
                                />
                            </FormControl>
                            <FormDescription>支持富文本编辑和实时预览。</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">立即发布</FormLabel>
                                <FormDescription>开启后，文章会直接在前台显示。</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? "保存修改" : "发布文章"}
                </Button>
            </form>
        </Form>
    )
}
