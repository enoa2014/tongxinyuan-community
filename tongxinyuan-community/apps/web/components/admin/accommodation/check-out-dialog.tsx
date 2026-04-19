"use client"

import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import PocketBase from "pocketbase"
import { Loader2 } from "lucide-react"

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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { AccommodationRecordsResponse, AccommodationUnitsRecord, BeneficiariesResponse } from "@/types/pocketbase-types"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

const formSchema = z.object({
    end_date: z.string().min(1, "End date is required"),
    fee_amount: z.string().optional(),
    payment_status: z.enum(["pending", "paid", "waived"]),
    waiver_reason: z.string().optional(),
    notes: z.string().optional(),
})

interface CheckOutDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    unit?: AccommodationUnitsRecord
    onSuccess: () => void
}

type AccommodationRecordWithBeneficiary = AccommodationRecordsResponse<{
    beneficiary?: BeneficiariesResponse
}>

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Failed to complete check-out"
}

export function CheckOutDialog({ open, onOpenChange, unit, onSuccess }: CheckOutDialogProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [activeRecord, setActiveRecord] = useState<AccommodationRecordWithBeneficiary | null>(null)
    const [fetchingRecord, setFetchingRecord] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            end_date: format(new Date(), "yyyy-MM-dd"),
            fee_amount: "",
            payment_status: "pending",
            waiver_reason: "",
            notes: "",
        },
    })
    const paymentStatus = form.watch("payment_status")

    const fetchActiveRecord = useCallback(async (unitId: string) => {
        setFetchingRecord(true)
        try {
            const records = await pb.collection("accommodation_records").getList<AccommodationRecordWithBeneficiary>(1, 1, {
                filter: `unit = "${unitId}" && record_type = "Check-in"`,
                sort: "-start_date",
                expand: "beneficiary",
            })

            if (records.items.length > 0) {
                setActiveRecord(records.items[0])
                form.reset({
                    end_date: format(new Date(), "yyyy-MM-dd"),
                    fee_amount: typeof records.items[0].fee_amount === "number" ? String(records.items[0].fee_amount) : "",
                    payment_status: records.items[0].payment_status || "pending",
                    waiver_reason: records.items[0].waiver_reason || "",
                    notes: "",
                })
                return
            }

            toast({
                title: "Warning",
                description: "No active check-in record found for this unit.",
                variant: "destructive",
            })
            onOpenChange(false)
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to fetch the active check-in record.",
                variant: "destructive",
            })
        } finally {
            setFetchingRecord(false)
        }
    }, [form, onOpenChange, toast])

    useEffect(() => {
        if (!open || !unit) {
            return
        }

        void fetchActiveRecord(unit.id)
    }, [fetchActiveRecord, open, unit])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!activeRecord || !unit) {
            return
        }

        setLoading(true)
        try {
            const parsedFeeAmount = values.fee_amount ? Number(values.fee_amount) : undefined
            await pb.collection("accommodation_records").update(activeRecord.id, {
                end_date: values.end_date,
                fee_amount: Number.isFinite(parsedFeeAmount) ? parsedFeeAmount : undefined,
                payment_status: values.payment_status,
                waiver_reason: values.payment_status === "waived" ? values.waiver_reason : "",
                notes: activeRecord.notes ? `${activeRecord.notes}\n${values.notes}` : values.notes,
            })

            await pb.collection("accommodation_units").update(unit.id, {
                status: "active",
            })

            toast({
                title: "Check-out successful",
                description: "The bed is now marked as available.",
            })
            onSuccess()
            onOpenChange(false)
        } catch (error: unknown) {
            console.error(error)
            toast({
                title: "Error",
                description: getErrorMessage(error),
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Check-out</DialogTitle>
                    <DialogDescription>Confirm check-out for {unit?.name}.</DialogDescription>
                </DialogHeader>

                {fetchingRecord ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {activeRecord?.expand?.beneficiary && (
                                <div className="rounded-md bg-muted p-3 text-sm">
                                    <span className="mb-1 block font-semibold">Current Occupant:</span>
                                    {activeRecord.expand.beneficiary.name}
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        (Since {new Date(activeRecord.start_date).toLocaleDateString()})
                                    </span>
                                </div>
                            )}

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

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Condition of room, refunds, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                                <Input placeholder="Reason for fee waiver..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Confirm Check-out
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}
