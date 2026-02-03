
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import PocketBase from "pocketbase"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

// Validate file type and size on client side roughly
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
    date: z.date(),
    hospital: z.string().optional(),
    department: z.string().optional(),
    doctor: z.string().optional(),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
    cost: z.string().optional().refine((val) => !val || !isNaN(Number(val)), "必须为数字"),
    notes: z.string().optional(),
    // File handling in react-hook-form is tricky. We'll handle it separately or use a custom field.
    // Just simple file input for now.
})

interface MedicalLogFormProps {
    beneficiaryId: string
    initialData?: any // Dictionary of the log data
    onSuccess?: () => void
    onCancel?: () => void
}

export function MedicalLogForm({ beneficiaryId, initialData, onSuccess, onCancel }: MedicalLogFormProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<FileList | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hospital: initialData?.hospital || "北京儿童医院",
            department: initialData?.department || "血液科",
            doctor: initialData?.doctor || "",
            diagnosis: initialData?.diagnosis || "",
            treatment: initialData?.treatment || "",
            cost: initialData?.cost ? String(initialData.cost) : "",
            notes: initialData?.notes || "",
            date: initialData?.date ? new Date(initialData.date) : new Date(),
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("beneficiary", beneficiaryId)
            formData.append("date", values.date.toISOString())
            if (values.hospital) formData.append("hospital", values.hospital)
            if (values.department) formData.append("department", values.department)
            if (values.doctor) formData.append("doctor", values.doctor)
            if (values.diagnosis) formData.append("diagnosis", values.diagnosis)
            if (values.treatment) formData.append("treatment", values.treatment)
            if (values.cost) formData.append("cost", values.cost)
            if (values.notes) formData.append("notes", values.notes)

            // For update, we might want to keep existing images if no new ones are uploaded?
            // PocketBase handles file updates by appending if I recall, but usually strict replace needs care.
            // For now, let's just append new files if provided.
            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    formData.append("images", files[i])
                }
            }

            if (initialData?.id) {
                await pb.collection("medical_logs").update(initialData.id, formData)
                toast({ title: "更新成功", description: "医疗日志已更新" })
            } else {
                await pb.collection("medical_logs").create(formData)
                toast({ title: "创建成功", description: "医疗日志已添加" })
            }
            onSuccess?.()
        } catch (e: any) {
            console.error("Submission error:", e)
            toast({
                title: "Error",
                description: `Failed to save: ${e.message}`,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>就诊日期 Date</FormLabel>
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
                                                    format(field.value, "yyyy-MM-dd")
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
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>自费金额 Cost (¥)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="hospital"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>医院 Hospital</FormLabel>
                                <FormControl>
                                    <Input placeholder="例如：北京儿童医院" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>科室 Department</FormLabel>
                                <FormControl>
                                    <Input placeholder="例如：血液科" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="doctor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>医生 Doctor</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="diagnosis"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>诊断 Diagnosis</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="treatment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>治疗方案 Treatment</FormLabel>
                            <FormControl>
                                <Textarea placeholder="简要描述治疗内容..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>备注 Notes</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>影像附件 Images (Max 10)</FormLabel>
                    <FormControl>
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                            className="cursor-pointer"
                        />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">支持 jpg, png, webp 等格式。</p>
                </FormItem>

                <div className="flex justify-end gap-2 pt-4">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            取消 Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading ? "保存中..." : "保存记录 Save Log"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
