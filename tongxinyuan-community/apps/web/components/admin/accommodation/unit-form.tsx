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
import { useState, useEffect } from "react"
import PocketBase from "pocketbase"
import { useToast } from "@/components/ui/use-toast"
import { AccommodationUnitsRecord, AccommodationUnitsTypeOptions, AccommodationUnitsStatusOptions } from "@/types/pocketbase-types"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.nativeEnum(AccommodationUnitsTypeOptions),
    status: z.nativeEnum(AccommodationUnitsStatusOptions),
    parent: z.string().optional(),
    tags: z.string().optional(), // For room metadata like "Standard", "VIP"
})

interface UnitFormProps {
    initialData?: AccommodationUnitsRecord
    // Presets for creating children
    parentUnitId?: string
    fixedType?: AccommodationUnitsTypeOptions

    onSuccess?: () => void
    onCancel?: () => void
}

export function UnitForm({ initialData, parentUnitId, fixedType, onSuccess, onCancel }: UnitFormProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    // Determine default type
    // If creating bed, parent is room.
    // If creating room, parent is floor or building.
    const defaultType = fixedType
        || initialData?.type
        || AccommodationUnitsTypeOptions.building

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            type: defaultType,
            status: initialData?.status || AccommodationUnitsStatusOptions.active,
            parent: parentUnitId || initialData?.parent || "",
            tags: (initialData as any)?.tags || "",
        },
    })

    // Reset if props change (for dialog re-use)
    useEffect(() => {
        form.reset({
            name: initialData?.name || "",
            type: initialData?.type || fixedType || AccommodationUnitsTypeOptions.building,
            status: initialData?.status || AccommodationUnitsStatusOptions.active,
            parent: parentUnitId || initialData?.parent || "",
            tags: (initialData as any)?.tags || "",
        })
    }, [initialData, parentUnitId, fixedType, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            if (initialData?.id) {
                await pb.collection("accommodation_units").update(initialData.id, values)
                toast({ title: "Updated", description: "Unit updated successfully" })
            } else {
                await pb.collection("accommodation_units").create(values)
                toast({ title: "Created", description: "Unit created successfully" })
            }
            onSuccess?.()
        } catch (e: any) {
            console.error(e)
            toast({ title: "Error", description: e.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const isTypeLocked = !!fixedType || !!initialData;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name (Title/Number)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Building A, Room 101, Bed 1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isTypeLocked}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="building">Building (楼栋)</SelectItem>
                                        <SelectItem value="floor">Floor (楼层)</SelectItem>
                                        <SelectItem value="room">Room (房间)</SelectItem>
                                        <SelectItem value="bed">Bed (床位)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Active (可用)</SelectItem>
                                        <SelectItem value="maintenance">Maintenance (维护)</SelectItem>
                                        <SelectItem value="occupied">Occupied (占用)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {(form.watch("type") === "room") && (
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags / Category (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Standard, VIP, Family" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="flex justify-end gap-2 pt-4">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : (initialData ? "Update Unit" : "Create Unit")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
