
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
import { useState, useEffect } from "react"
import PocketBase from "pocketbase"
import { useToast } from "@/components/ui/use-toast"
import { AccommodationRecordsRecord, AccommodationUnitsRecord } from "@/types/pocketbase-types"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
    initialData?: AccommodationRecordsRecord
    onSuccess?: () => void
    onCancel?: () => void
}

export function AccommodationForm({ beneficiaryId, initialData, onSuccess, onCancel }: AccommodationFormProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [isLinked, setIsLinked] = useState(true) // Default to linked for new records
    const [availableUnits, setAvailableUnits] = useState<AccommodationUnitsRecord[]>([])
    const [unitsLoading, setUnitsLoading] = useState(false)

    // Load available units when 'isLinked' becomes true
    useEffect(() => {
        if (isLinked) {
            setUnitsLoading(true)
            pb.collection("accommodation_units").getList(1, 100, {
                filter: 'status = "active" && (type = "bed" || type = "room")', // Only fetch available beds or rooms
                sort: 'name'
            }).then(res => {
                setAvailableUnits(res.items)
            }).catch(e => {
                console.error("Failed to load units", e)
            }).finally(() => {
                setUnitsLoading(false)
            })
        }
    }, [isLinked])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            room_number: initialData?.room_number || "待分配", // Default placeholder
            record_type: initialData?.record_type || "Check-in",
            start_date: initialData?.start_date ? initialData.start_date.split(' ')[0] : new Date().toISOString().split('T')[0],
            end_date: initialData?.end_date ? initialData.end_date.split(' ')[0] : "",
            notes: initialData?.notes || "",
        },
    })

    // If editing an existing record that has a linked unit, keep it linked but maybe valid to strictly manual if unit is gone
    useEffect(() => {
        if (initialData?.unit) {
            setIsLinked(true)
        } else if (initialData && !initialData.unit) {
            setIsLinked(false)
        }
    }, [initialData])

    // State to track selected unit ID for submission (separate from typical form field if we want custom logic)
    const [selectedUnitId, setSelectedUnitId] = useState(initialData?.unit || "")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            // Prepare payload
            const payload: any = {
                ...values,
                start_date: values.start_date ? `${values.start_date} 00:00:00` : "",
                end_date: values.end_date ? `${values.end_date} 00:00:00` : "",
                beneficiary: beneficiaryId,
            }

            // Logic for Linked vs Manual
            if (isLinked) {
                if (!selectedUnitId) {
                    throw new Error("请选择一个房源 (Please select a unit)")
                }
                payload.unit = selectedUnitId
                // Snapshot the name
                const unitName = availableUnits.find(u => u.id === selectedUnitId)?.name || initialData?.room_number || "Unknown"
                payload.room_number = unitName
            } else {
                // Manual mode: remove unit link if it existed? Or just ignore? usually we assume no unit link.
                // If we are editing and switching to manual, we might want to clear 'unit'.
                payload.unit = null
                // room_number is already in 'values' from the input
            }

            let recordId = initialData?.id

            if (recordId) {
                await pb.collection("accommodation_records").update(recordId, payload)
                toast({ title: "已更新", description: "住宿记录已更新" })
            } else {
                const rec = await pb.collection("accommodation_records").create(payload)
                recordId = rec.id
                toast({ title: "已创建", description: "新住宿记录已添加" })
            }

            // Post-creation Side Effects: Update Unit Status
            // Only update status if it's a NEW check-in and we have a linked unit
            if (isLinked && selectedUnitId && (!initialData || !initialData.unit)) {
                await pb.collection("accommodation_units").update(selectedUnitId, { status: "occupied" })
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

                {/* Mode Toggle */}
                <div className="flex items-center space-x-2 bg-muted/20 p-3 rounded-md">
                    <div className="flex-1">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            关联库存房源 (Link to Inventory)
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                            {isLinked ? "从现有空闲床位中选择，将自动更新房源状态。" : "仅作为历史记录手动输入，不占用当前库存。"}
                        </p>
                    </div>
                    <input
                        type="checkbox"
                        className="toggle toggle-primary" // Assuming daisyUI or similar, replacing with simple checkbox or Switch if available
                        checked={isLinked}
                        onChange={(e) => setIsLinked(e.target.checked)}
                        style={{ width: "2rem", height: "1rem" }} // Simple inline style fallback
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {isLinked ? (
                        <FormItem>
                            <FormLabel>选择房源 Select Unit</FormLabel>
                            <Select
                                value={selectedUnitId}
                                onValueChange={(val) => {
                                    setSelectedUnitId(val)
                                    // Auto-fill room number for display/snapshot
                                    const u = availableUnits.find(unit => unit.id === val)
                                    if (u) form.setValue("room_number", u.name)
                                }}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={unitsLoading ? "加载中..." : "选择床位/房间..."} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {availableUnits.map(u => (
                                        <SelectItem key={u.id} value={u.id}>
                                            {u.type === "bed" ? "🛏️" : "🏠"} {u.name}
                                        </SelectItem>
                                    ))}
                                    {availableUnits.length === 0 && !unitsLoading && (
                                        <div className="p-2 text-sm text-muted-foreground text-center">无可用房源</div>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    ) : (
                        <FormField
                            control={form.control}
                            name="room_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>房间号/床位名 (手动输入)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. 101, Bed A" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

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
