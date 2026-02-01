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
import { useToast } from "@/components/ui/use-toast"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    category: z.enum(["Medical Report", "ID Document", "Application Form", "Agreement", "Other"]),
    file: z.instanceof(FileList).refine((files) => files.length > 0, "File is required")
        .refine((files) => files[0]?.size <= 10485760, "Max file size is 10MB"),
})

interface DocumentUploadProps {
    beneficiaryId: string
    onSuccess: () => void
}

export function DocumentUpload({ beneficiaryId, onSuccess }: DocumentUploadProps) {
    const { toast } = useToast()
    const [isUploading, setIsUploading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            category: "Medical Report",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("video", "") // Hack to ensure multipart/form-data? No, PB SDK handles it.
            // PB expects file field to be the file object
            formData.append("file", values.file[0])
            formData.append("title", values.title)
            formData.append("category", values.category)
            // Use beneficiary_id to match the filter behavior observed
            formData.append("beneficiary_id", beneficiaryId)

            await pb.collection("beneficiary_documents").create(formData)

            toast({
                title: "Success",
                description: "Document uploaded successfully",
            })
            form.reset()
            onSuccess()
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to upload document",
                variant: "destructive",
            })
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange, value, ...fieldProcess } }) => (
                        <FormItem>
                            <FormLabel>File (PDF, Doc, Xls, etc.)</FormLabel>
                            <FormControl>
                                <Input
                                    {...fieldProcess}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.webp"
                                    onChange={(e) => {
                                        onChange(e.target.files)
                                        // Auto-fill title if empty
                                        if (e.target.files?.[0] && !form.getValues("title")) {
                                            const name = e.target.files[0].name.split('.').slice(0, -1).join('.')
                                            form.setValue("title", name)
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormDescription>Max 10MB.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Document Title" {...field} />
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
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Medical Report">Medical Report</SelectItem>
                                    <SelectItem value="ID Document">ID Document</SelectItem>
                                    <SelectItem value="Application Form">Application Form</SelectItem>
                                    <SelectItem value="Agreement">Agreement</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isUploading}>
                    {isUploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Document
                        </>
                    )}
                </Button>
            </form>
        </Form>
    )
}
