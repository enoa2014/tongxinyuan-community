
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Download, Save, Loader2, UploadCloud } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { cn } from "@/lib/utils"
// Ensure these imports point to your actual UI library locations; adjusting based on standard shadcn/ui paths
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { PosterPreview } from "./poster-preview"
import html2canvas from "html2canvas"
import pb from "@/lib/pocketbase"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    project_name: z.string().min(2, { message: "项目名称至少2个字" }),
    donor_name: z.string().min(2, { message: "捐赠方名称至少2个字" }),
    amount: z.string().min(1, { message: "请输入金额或物资描述" }),
    donate_date: z.date({ required_error: "请选择捐赠日期" }),
    description: z.string().optional(),
    status: z.enum(["draft", "published"]),
})

export function DonationForm() {
    const [images, setImages] = React.useState<File[]>([])
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([])
    const [isSaving, setIsSaving] = React.useState(false)
    const [isExporting, setIsExporting] = React.useState(false)
    const posterRef = React.useRef<HTMLDivElement>(null)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            project_name: "暖冬计划",
            donor_name: "",
            amount: "",
            donate_date: new Date(),
            description: "",
            status: "published",
        },
    })

    // Watch values for live preview
    const watchedValues = form.watch()

    // Handle Image Upload (Client-side Preview)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setImages(prev => [...prev, ...files])

            // Create object URLs for preview
            const newPreviews = files.map(file => URL.createObjectURL(file))
            setImagePreviews(prev => [...prev, ...newPreviews])
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const exportToImage = async () => {
        if (!posterRef.current) return
        setIsExporting(true)
        try {
            const canvas = await html2canvas(posterRef.current, {
                useCORS: true,
                scale: 2, // Higher resolution
                backgroundColor: "#ffffff",
            })

            const link = document.createElement("a")
            link.download = `捐赠公示-${watchedValues.donor_name || '未命名'}.png`
            link.href = canvas.toDataURL("image/png")
            link.click()
            toast({ title: "导出成功", description: "海报图片已下载" })
        } catch (error) {
            console.error(error)
            toast({ title: "导出失败", description: "无法生成图片", variant: "destructive" })
        } finally {
            setIsExporting(false)
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSaving(true)
        try {
            const formData = new FormData()
            formData.append('project_name', values.project_name)
            formData.append('donor_name', values.donor_name)
            formData.append('amount', values.amount)
            formData.append('donate_date', values.donate_date.toISOString())
            formData.append('description', values.description || "")
            formData.append('status', values.status)

            images.forEach(img => {
                formData.append('images', img)
            })

            await pb.collection('public_donations').create(formData)
            toast({ title: "保存成功", description: "捐赠公示已发布" })

            // Optionally redirect or reset
            // router.push('/admin/donations')
        } catch (error) {
            console.error(error)
            toast({ title: "保存失败", description: "请重试", variant: "destructive" })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
            {/* LEFT: Form Input */}
            <Card className="h-full overflow-y-auto border-none shadow-none lg:pr-4">
                <CardHeader className="px-0">
                    <CardTitle>录入捐赠信息</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="project_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>项目名称</FormLabel>
                                        <FormControl>
                                            <Input placeholder="例如：暖冬计划、爱心午餐" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="donor_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>捐赠方 / 捐赠人</FormLabel>
                                        <FormControl>
                                            <Input placeholder="例如：某某基金会、李先生" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>捐赠内容 (金额/物资)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="¥5000 或 50套棉服" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="donate_date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>捐赠日期</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP", { locale: zhCN })
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onSelect}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
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
                                        <FormLabel>详细说明 / 背后的故事</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="(选填) 还可以写一段简短的感谢语..." className="h-24" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Image Upload */}
                            <div className="space-y-3">
                                <FormLabel>现场照片 (建议上传 1-3 张)</FormLabel>
                                <div className="grid grid-cols-3 gap-4">
                                    {imagePreviews.map((src, idx) => (
                                        <div key={idx} className="relative aspect-square border rounded-md overflow-hidden group">
                                            <img src={src} alt="preview" className="object-cover w-full h-full" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <label className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors text-muted-foreground">
                                        <UploadCloud className="h-8 w-8 mb-2" />
                                        <span className="text-xs">点击上传</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <Button type="submit" disabled={isSaving} className="w-full">
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    保存并发布
                                </Button>
                                <Button type="button" variant="outline" onClick={exportToImage} disabled={isExporting} className="w-full">
                                    {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                                    下载海报图片
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* RIGHT: Live Preview */}
            <div className="h-full bg-slate-100 rounded-lg p-8 flex items-center justify-center overflow-auto shadow-inner border">
                <div className="scale-[0.8] origin-center">
                    <PosterPreview
                        ref={posterRef}
                        data={{
                            project_name: watchedValues.project_name,
                            donor_name: watchedValues.donor_name,
                            amount: watchedValues.amount,
                            donate_date: watchedValues.donate_date,
                            description: watchedValues.description || "",
                            images: imagePreviews
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
