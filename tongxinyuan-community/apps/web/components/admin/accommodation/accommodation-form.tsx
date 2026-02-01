
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import PocketBase from "pocketbase"
import { useToast } from "@/components/ui/use-toast"
import { AccommodationRecord } from "@/types/accommodation"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

const formSchema = z.object({
    room_number: z.string().min(1, "房间号必填"),
    record_type: z.enum(["Check-in", "Extension", "Check-out", "Transfer"]),
    start_date: z.string().min(1, "开始日期必填"),
    end_date: z.string().optional(),
    notes: z.string().optional(),
})

interface AccommodationFormProps {
    beneficiaryId: string
    initialData?: AccommodationRecord
    onSuccess?: () => void
    onCancel?: () => void
}

export function AccommodationForm({ beneficiaryId, initialData, onSuccess, onCancel }: AccommodationFormProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            room_number: initialData?.room_number || "",
            record_type: initialData?.record_type || "Check-in",
            // PocketBase returns UTC strings '2026-02-01 12:00:00.000Z', input date expects 'YYYY-MM-DD'
            start_date: initialData?.start_date ? initialData.start_date.split(' ')[0] : new Date().toISOString().split('T')[0],
            end_date: initialData?.end_date ? initialData.end_date.split(' ')[0] : "",
            notes: initialData?.notes || "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            // PB date fields often require full datetime or proper formatting. 
            // Appending time to ensure valid Date parsing just in case.
            const payload = {
                ...values,
                start_date: values.start_date ? `${values.start_date} 00:00:00` : "",
                end_date: values.end_date ? `${values.end_date} 00:00:00` : "",
                beneficiary: beneficiaryId,
            }

            if (initialData?.id) {
                await pb.collection("accommodation_records").update(initialData.id, payload)
                toast({ title: "已更新", description: "住宿记录已更新" })
            } else {
                await pb.collection("accommodation_records").create(payload)
                toast({ title: "已创建", description: "新住宿记录已添加" })
            }
            onSuccess?.()
        } catch (e: any) {
            console.error(e)
            toast({
                title: "失败",
                description: e.message || "无法保存记录",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="room_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>房间号 Room No.</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="e.g. 101" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="record_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>类型 Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Check-in">入住 Check-in</SelectItem>
                                        <SelectItem value="Extension">续住 Extension</SelectItem>
                                        <SelectItem value="Transfer">转房 Transfer</SelectItem>
                                        <SelectItem value="Check-out">退房 Check-out</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>开始日期 Start Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>结束日期 End Date</FormLabel>
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
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>备注 Notes</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="其他说明..." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            取消
                        </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading ? "保存中..." : (initialData ? "更新" : "添加")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
