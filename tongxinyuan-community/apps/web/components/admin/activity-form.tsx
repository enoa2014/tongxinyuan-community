"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, Trash, X, UploadCloud, FileText, Image as ImageIcon, Video, Link as LinkIcon, Calendar, MapPin } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { pb } from "@/lib/pocketbase"
import { Activity } from "@/types"

const activitySchema = z.object({
    title: z.string().min(2, "标题至少 2 个字符"),
    category: z.string(),
    status: z.string(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),
    lead_staff: z.string().optional(),
    external_links: z.array(z.object({
        title: z.string().min(1, "链接标题不能为空"),
        url: z.string().url("请输入有效的 URL")
    })).optional()
})

interface ActivityFormProps {
    initialData?: Activity
    staffList?: any[]
}

const NEXT_PUBLIC_PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090"

export function ActivityForm({ initialData, staffList = [] }: ActivityFormProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof activitySchema>>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            title: initialData?.title || "",
            category: initialData?.category || "other",
            status: initialData?.status || "planning",
            start_time: initialData?.start_time ? new Date(initialData.start_time).toISOString().slice(0, 16) : "",
            end_time: initialData?.end_time ? new Date(initialData.end_time).toISOString().slice(0, 16) : "",
            location: initialData?.location || "",
            summary: initialData?.summary || "",
            lead_staff: initialData?.lead_staff || (pb.authStore.model?.id),
            external_links: initialData?.external_links || []
        },
    })

    const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
        control: form.control,
        name: "external_links"
    })

    const [photos, setPhotos] = useState<FileList | null>(null)
    const [documents, setDocuments] = useState<FileList | null>(null)
    const [videos, setVideos] = useState<FileList | null>(null)

    async function onSubmit(values: z.infer<typeof activitySchema>) {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('title', values.title)
            formData.append('category', values.category)
            formData.append('status', values.status)
            if (values.start_time) formData.append('start_time', new Date(values.start_time).toISOString())
            if (values.end_time) formData.append('end_time', new Date(values.end_time).toISOString())
            if (values.location) formData.append('location', values.location)
            if (values.summary) formData.append('summary', values.summary)
            if (values.lead_staff) formData.append('lead_staff', values.lead_staff)
            formData.append('external_links', JSON.stringify(values.external_links))

            if (photos) {
                for (let i = 0; i < photos.length; i++) formData.append('photos', photos[i])
            }
            if (documents) {
                for (let i = 0; i < documents.length; i++) formData.append('documents', documents[i])
            }
            if (videos) {
                for (let i = 0; i < videos.length; i++) formData.append('videos', videos[i])
            }

            if (initialData) {
                await pb.collection("activities").update(initialData.id, formData)
                toast({ title: "活动已更新" })
            } else {
                await pb.collection("activities").create(formData)
                toast({ title: "活动创建成功" })
            }

            router.push("/admin/activities")
            router.refresh()
        } catch (error) {
            console.error("Failed to submit activity:", error)
            toast({
                title: "提交失败",
                description: "请检查网络或稍后重试",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const getFileUrl = (filename: string) => {
        if (!initialData) return ""
        return `${NEXT_PUBLIC_PB_URL}/api/files/${initialData.collectionId}/${initialData.id}/${filename}`
    }

    // Helper component for file input
    const FileUploadInput = ({
        icon: Icon,
        label,
        description,
        accept,
        onChange,
        files,
        existingFiles
    }: any) => (
        <div className="border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors text-center relative group">
            <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept={accept}
                multiple
                onChange={(e) => onChange(e.target.files)}
            />
            <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                {files && files.length > 0 && (
                    <div className="mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        已选择 {files.length} 个文件
                    </div>
                )}
            </div>

            {/* Existing Files Preview */}
            {existingFiles && existingFiles.length > 0 && (
                <div className="mt-4 pt-4 border-t w-full text-left relative z-20">
                    <p className="text-xs text-muted-foreground mb-2">已上传:</p>
                    <div className="flex flex-wrap gap-2">
                        {existingFiles.map((file: string, i: number) => (
                            <a
                                key={i}
                                href={getFileUrl(file)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded hover:text-primary transition-colors"
                                onClick={(e) => e.stopPropagation()} // Prevent triggering file input
                            >
                                <span className="truncate max-w-[100px]">{file}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{initialData ? "编辑活动" : "发起新活动"}</h2>
                        <p className="text-muted-foreground">填写活动详细信息并归档相关资料。</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            取消
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-brand-green hover:bg-brand-green/90 min-w-[120px]">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "保存修改" : "创建活动"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">基本信息</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>活动标题</FormLabel>
                                            <FormControl>
                                                <Input placeholder="例如：2026新春关爱探访" className="text-lg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>活动类型</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="选择类型" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="festival">节日活动</SelectItem>
                                                        <SelectItem value="home_care">居家照护</SelectItem>
                                                        <SelectItem value="school_visit">爱心入校</SelectItem>
                                                        <SelectItem value="home_visit">入户探访</SelectItem>
                                                        <SelectItem value="training">志愿者培训</SelectItem>
                                                        <SelectItem value="other">其他</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>状态</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="选择状态" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="planning">策划中</SelectItem>
                                                        <SelectItem value="recruiting">招募中</SelectItem>
                                                        <SelectItem value="ongoing">进行中</SelectItem>
                                                        <SelectItem value="review">复盘中</SelectItem>
                                                        <SelectItem value="completed">已归档</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="summary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>活动简介 / 总结</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="请输入活动的主要内容、目标人群及注意事项..."
                                                    className="min-h-[120px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <UploadCloud className="w-4 h-4 text-primary" />
                                    归档资料
                                </CardTitle>
                                <CardDescription>上传活动相关的照片、视频和文档材料。</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormItem className="col-span-1 md:col-span-2">
                                    <FileUploadInput
                                        icon={ImageIcon}
                                        label="上传照片"
                                        description="JPG, PNG, WEBP (Max 10)"
                                        accept="image/*"
                                        onChange={setPhotos}
                                        files={photos}
                                        existingFiles={initialData?.photos}
                                    />
                                </FormItem>
                                <FormItem>
                                    <FileUploadInput
                                        icon={Video}
                                        label="上传视频"
                                        description="MP4, MOV (Max 5, 500MB)"
                                        accept="video/*"
                                        onChange={setVideos}
                                        files={videos}
                                        existingFiles={initialData?.videos}
                                    />
                                </FormItem>
                                <FormItem>
                                    <FileUploadInput
                                        icon={FileText}
                                        label="相关文档"
                                        description="PDF, Office, MD, TXT"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md"
                                        onChange={setDocuments}
                                        files={documents}
                                        existingFiles={initialData?.documents}
                                    />
                                </FormItem>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">执行信息</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="lead_staff"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>负责社工</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="选择负责人" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {staffList.map(staff => (
                                                        <SelectItem key={staff.id} value={staff.id}>
                                                            {staff.name || staff.email}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="start_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>开始时间</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input type="datetime-local" className="pl-9" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="end_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>结束时间</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input type="datetime-local" className="pl-9" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>活动地点</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input placeholder="输入地点..." className="pl-9" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium">外部链接</CardTitle>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => appendLink({ title: "", url: "" })}
                                    className="h-8 px-2"
                                >
                                    <Plus className="h-4 w-4 mr-1" /> 添加
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                {linkFields.map((field, index) => (
                                    <div key={field.id} className="group relative bg-muted/30 p-3 rounded-lg border hover:border-primary/30 transition-colors">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeLink(index)}
                                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                        <FormField
                                            control={form.control}
                                            name={`external_links.${index}.title`}
                                            render={({ field }) => (
                                                <FormItem className="mb-2">
                                                    <FormControl>
                                                        <Input placeholder="链接标题" className="h-8 text-sm bg-transparent border-0 border-b border-transparent focus-visible:border-primary px-0 rounded-none shadow-none focus-visible:ring-0" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`external_links.${index}.url`}
                                            render={({ field }) => (
                                                <div className="flex items-center gap-2">
                                                    <LinkIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                                                    <FormControl>
                                                        <Input placeholder="https://..." className="h-6 text-xs bg-transparent border-0 px-0 shadow-none focus-visible:ring-0 text-muted-foreground" {...field} />
                                                    </FormControl>
                                                </div>
                                            )}
                                        />
                                    </div>
                                ))}
                                {linkFields.length === 0 && (
                                    <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                        <p className="text-sm">暂无外部链接</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    )
}
