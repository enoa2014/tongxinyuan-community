"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import PocketBase from "pocketbase"

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
import { useToast } from "@/components/ui/use-toast"
import { AccommodationRecord } from "@/types/accommodation"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

const formSchema = z.object({
    room_number: z.string().min(1, "Room number is required"),
    record_type: z.enum(["Check-in", "Extension", "Check-out", "Transfer"]),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional(),
    fee_amount: z.string().optional(),
    payment_status: z.enum(["pending", "paid", "waived"]),
    waiver_reason: z.string().optional(),
    notes: z.string().optional(),
})

interface AccommodationFormProps {
    beneficiaryId: string
    initialData?: AccommodationRecord
    onSuccess?: () => void
    onCancel?: () => void
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unable to save the accommodation record"
}

export function AccommodationForm({ beneficiaryId, initialData, onSuccess, onCancel }: AccommodationFormProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            room_number: initialData?.room_number || "",
            record_type: initialData?.record_type || "Check-in",
            // PocketBase returns UTC strings like '2026-02-01 12:00:00.000Z', while the input expects 'YYYY-MM-DD'.
            start_date: initialData?.start_date ? initialData.start_date.split(" ")[0] : new Date().toISOString().split("T")[0],
            end_date: initialData?.end_date ? initialData.end_date.split(" ")[0] : "",
            fee_amount: typeof initialData?.fee_amount === "number" ? String(initialData.fee_amount) : "",
            payment_status: initialData?.payment_status || "pending",
            waiver_reason: initialData?.waiver_reason || "",
            notes: initialData?.notes || "",
        },
    })
    const paymentStatus = form.watch("payment_status")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const parsedFeeAmount = values.fee_amount ? Number(values.fee_amount) : undefined
            const payload = {
                ...values,
                start_date: values.start_date ? `${values.start_date} 00:00:00` : "",
                end_date: values.end_date ? `${values.end_date} 00:00:00` : "",
                fee_amount: Number.isFinite(parsedFeeAmount) ? parsedFeeAmount : undefined,
                waiver_reason: values.payment_status === "waived" ? values.waiver_reason : "",
                beneficiary: beneficiaryId,
            }

            if (initialData?.id) {
                await pb.collection("accommodation_records").update(initialData.id, payload)
                toast({ title: "Updated", description: "Accommodation record updated." })
            } else {
                await pb.collection("accommodation_records").create(payload)
                toast({ title: "Created", description: "Accommodation record added." })
            }

            onSuccess?.()
        } catch (error: unknown) {
            console.error(error)
            toast({
                title: "Save failed",
                description: getErrorMessage(error),
                variant: "destructive",
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
                                <FormLabel>Room Number</FormLabel>
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
                                <FormLabel>Record Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Check-in">Check-in</SelectItem>
                                        <SelectItem value="Extension">Extension</SelectItem>
                                        <SelectItem value="Transfer">Transfer</SelectItem>
                                        <SelectItem value="Check-out">Check-out</SelectItem>
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
                                <FormLabel>Start Date</FormLabel>
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
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="fee_amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fee Amount</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="payment_status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="waived">Waived</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {paymentStatus === "waived" && (
                    <FormField
                        control={form.control}
                        name="waiver_reason"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Waiver Reason</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Reason for fee waiver..." />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Additional notes..." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : initialData ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
