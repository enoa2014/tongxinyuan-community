
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const newsFormSchema = z.object({
    title: z.string().min(2, "标题至少需要2个字符"),
    slug: z.string().min(2, "URL别名至少需要2个字符").regex(/^[a-z0-9-]+$/, "只能包含小写字母、数字和连字符"),
    description: z.string().max(200, "简介不能超过200字"),
    author: z.string().min(1, "请填写作者"),
    category: z.enum(["news", "story", "notice", "activity"]),
    content: z.string().min(10, "正文太短了"),
    published: z.boolean().default(false),
})

type NewsFormValues = z.infer<typeof newsFormSchema>

interface NewsFormProps {
    initialData?: any
    isEdit?: boolean
}

export function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [coverFile, setCoverFile] = useState<File | null>(null)

    const form = useForm<NewsFormValues>({
        resolver: zodResolver(newsFormSchema),
        defaultValues: initialData || {
            title: "",
            slug: "",
            description: "",
            author: "同心源",
            category: "news",
            content: "",
            published: false,
        },
    })

    async function onSubmit(data: NewsFormValues) {
        setIsLoading(true)
        try {
            const formData = new FormData()

            // Append all text fields
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value.toString())
            })

            // Append file if selected
            if (coverFile) {
                formData.append('cover', coverFile)
            }

            if (isEdit && initialData?.id) {
                await pb.collection('news').update(initialData.id, formData)
                toast({ title: "更新成功", description: "文章已更新" })
            } else {
                await pb.collection('news').create(formData)
                toast({ title: "发布成功", description: "新文章已创建" })
            }

            router.push('/admin/news')
            router.refresh()
        } catch (error: any) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "操作失败",
                description: error?.data?.message || "请检查网络或字段格式",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>文章标题</FormLabel>
                                <FormControl>
                                    <Input placeholder="输入标题..." {...field} />
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
                                <FormLabel>URL 别名 (Slug)</FormLabel>
                                <FormControl>
                                    <Input placeholder="english-slug-only" {...field} />
                                </FormControl>
                                <FormDescription>用于生成友好的文章链接，只能包含字母数字和横杠</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <FormLabel>简介 (摘要)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="一句话介绍这篇文章..."
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
                            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                        />
                    </FormControl>
                    <FormDescription>
                        {initialData?.cover ? `当前已有封面: ${initialData.cover}` : "选择一张图片作为封面 (最大 5MB)"}
                    </FormDescription>
                </FormItem>

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>文章正文 (Markdown/HTML)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="# 请在此撰写文章内容..."
                                    className="min-h-[300px] font-mono text-sm"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                暂时支持纯文本或 Markdown 语法。
                            </FormDescription>
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
                                <FormDescription>
                                    开启后，文章将立即在前台可见。
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
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
