
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
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
import { AccommodationUnitsRecord, BeneficiariesResponse } from "@/types/pocketbase-types"
import { Loader2 } from "lucide-react"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

const formSchema = z.object({
    beneficiary: z.string().min(1, "Please select a beneficiary"),
    unit: z.string().min(1, "Please select a unit"),
    start_date: z.string().min(1, "Start date is required"),
    expected_end_date: z.string().optional(),
    notes: z.string().optional(),
})

interface CheckInDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialUnit?: AccommodationUnitsRecord
    onSuccess: () => void
}

export function CheckInDialog({ open, onOpenChange, initialUnit, onSuccess }: CheckInDialogProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [beneficiaries, setBeneficiaries] = useState<BeneficiariesResponse[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unit: initialUnit?.id || "",
            start_date: format(new Date(), "yyyy-MM-dd"),
            notes: "",
        },
    })

    // Reset form when initialUnit changes
    useEffect(() => {
        if (initialUnit) {
            form.setValue("unit", initialUnit.id)
        }
    }, [initialUnit, form])

    // Load active beneficiaries on open
    useEffect(() => {
        if (open) {
            loadBeneficiaries()
        }
    }, [open])

    async function loadBeneficiaries() {
        try {
            const result = await pb.collection("beneficiaries").getList<BeneficiariesResponse>(1, 100, {
                filter: 'status = "active"',
                sort: 'name',
                fields: 'id,name,id_card'
            })
            setBeneficiaries(result.items)
        } catch (e) {
            console.error(e)
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            // 1. Create Accommodation Record
            await pb.collection("accommodation_records").create({
                beneficiary: values.beneficiary,
                unit: values.unit,
                start_date: values.start_date,
                end_date: values.expected_end_date,
                record_type: "Check-in",
                room_number: initialUnit?.name || "Unknown", // Snapshot
                notes: values.notes,
            })

            // 2. Update Unit Status
            await pb.collection("accommodation_units").update(values.unit, {
                status: "occupied"
            })

            toast({ title: "Success", description: "Beneficiary checked in successfully" })
            onSuccess()
            onOpenChange(false)
        } catch (error: unknown) {
            console.error(error)
            const message = error instanceof Error ? error.message : "Unknown error"
            toast({ title: "Error", description: message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>办理入住 Check-in</DialogTitle>
                    <DialogDescription>
                        为受助人分配床位/房间。
                        {initialUnit && <span className="block font-medium mt-1 text-primary">Selected Unit: {initialUnit.name}</span>}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="beneficiary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>选择受助人 Select Beneficiary</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a beneficiary..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {beneficiaries.map(b => (
                                                <SelectItem key={b.id} value={b.id}>
                                                    {b.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="start_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>入住日期 Start Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="expected_end_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>预计离开 Expected End</FormLabel>
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
                                        <Input placeholder="Extra requests..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Confirm Check-in
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
