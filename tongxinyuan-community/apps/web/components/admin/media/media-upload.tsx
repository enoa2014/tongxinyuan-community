"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import PocketBase from "pocketbase"
import { Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

// Limit file size to 5MB on client side validation
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const formSchema = z.object({
    file: z
        .any()
        .refine((files) => files?.length > 0, "Image is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        ),
    caption: z.string().optional(),
    category: z.enum(["Life", "Medical", "Document", "Other"]),
    is_public: z.boolean().default(false),
    captured_date: z.string().optional(), // Date input returns string
})

interface MediaUploadProps {
    beneficiaryId: string
    onSuccess: () => void
}

export function MediaUpload({ beneficiaryId, onSuccess }: MediaUploadProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: "Life",
            is_public: false,
            caption: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("file", values.file[0])
            formData.append("beneficiary", beneficiaryId)
            formData.append("category", values.category)
            formData.append("is_public", values.is_public.toString())
            if (values.caption) formData.append("caption", values.caption)
            if (values.captured_date) formData.append("captured_date", values.captured_date)

            await pb.collection("beneficiary_media").create(formData)

            toast({ title: "Success", description: "Photo uploaded successfully" })
            form.reset()
            onSuccess()
        } catch (e: any) {
            console.error(e)
            toast({ title: "Error", description: e.message || "Failed to upload photo", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                            <FormLabel>照片 Photo</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    disabled={loading}
                                    onChange={(e) => {
                                        onChange(e.target.files)
                                    }}
                                    {...rest}
                                />
                            </FormControl>
                            <FormDescription>支持 JPG, PNG, WebP (Max 5MB)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>描述 Caption</FormLabel>
                            <FormControl>
                                <Input placeholder="如：第一次化疗后..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>分类 Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Life">生活照 Life</SelectItem>
                                        <SelectItem value="Medical">医疗记录 Medical</SelectItem>
                                        <SelectItem value="Document">证明材料 Document</SelectItem>
                                        <SelectItem value="Other">其他 Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="captured_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>拍摄日期 Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="is_public"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/30">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    公开展示 Public Visibility
                                </FormLabel>
                                <FormDescription>
                                    如果选中，图片将展示在公众门户网站上。请确保不包含隐私敏感信息。
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Upload Photo
                </Button>
            </form>
        </Form>
    )
}
