
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
import { useToast } from "@/components/ui/use-toast"
import { AccommodationUnitsRecord, AccommodationRecordsResponse, BeneficiariesResponse } from "@/types/pocketbase-types"
import { Loader2 } from "lucide-react"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

const formSchema = z.object({
    end_date: z.string().min(1, "End date is required"),
    notes: z.string().optional(),
})

interface CheckOutDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    unit?: AccommodationUnitsRecord // The occupied unit
    onSuccess: () => void
}

type AccommodationRecordWithBeneficiary = AccommodationRecordsResponse<{
    beneficiary?: BeneficiariesResponse
}>

export function CheckOutDialog({ open, onOpenChange, unit, onSuccess }: CheckOutDialogProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [activeRecord, setActiveRecord] = useState<AccommodationRecordWithBeneficiary | null>(null)
    const [fetchingRecord, setFetchingRecord] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            end_date: format(new Date(), "yyyy-MM-dd"),
            notes: "",
        },
    })

    useEffect(() => {
        if (open && unit) {
            fetchActiveRecord(unit.id)
        }
    }, [open, unit])

    async function fetchActiveRecord(unitId: string) {
        setFetchingRecord(true)
        try {
            // Find the most recent Check-in record for this unit
            const records = await pb.collection("accommodation_records").getList<AccommodationRecordWithBeneficiary>(1, 1, {
                filter: `unit = "${unitId}" && record_type = "Check-in"`,
                sort: '-start_date', // Latest one (Note: -created fails on this collection for unknown reasons)
                expand: 'beneficiary'
            })

            if (records.items.length > 0) {
                setActiveRecord(records.items[0])
            } else {
                toast({ title: "Warning", description: "No active check-in record found for this unit.", variant: "destructive" })
                onOpenChange(false)
            }
        } catch (e) {
            console.error(e)
            toast({ title: "Error", description: "Failed to fetch active record", variant: "destructive" })
        } finally {
            setFetchingRecord(false)
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!activeRecord || !unit) return

        setLoading(true)
        try {
            // 1. Update the existing record with actual end_date and notes
            await pb.collection("accommodation_records").update(activeRecord.id, {
                end_date: values.end_date,
                notes: activeRecord.notes ? activeRecord.notes + "\n" + values.notes : values.notes
            })

            // 2. Set unit status back to active
            await pb.collection("accommodation_units").update(unit.id, {
                status: "active"
            })

            toast({ title: "Check-out Successful", description: "Bed is now marked as available." })
            onSuccess()
            onOpenChange(false)
        } catch (e: any) {
            console.error(e)
            toast({ title: "Error", description: e.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>办理退房 Check-out</DialogTitle>
                    <DialogDescription>
                        Confirm check-out for {unit?.name}.
                    </DialogDescription>
                </DialogHeader>

                {fetchingRecord ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {activeRecord?.expand?.beneficiary && (
                                <div className="bg-muted p-3 rounded-md text-sm">
                                    <span className="font-semibold block mb-1">Current Occupant:</span>
                                    {activeRecord.expand.beneficiary.name}
                                    <span className="text-muted-foreground ml-2 text-xs">
                                        (Since {new Date(activeRecord.start_date).toLocaleDateString()})
                                    </span>
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="end_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>退房日期 End Date</FormLabel>
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
                                        <FormLabel>备注 Notes</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Condition of room, refunds, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
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
