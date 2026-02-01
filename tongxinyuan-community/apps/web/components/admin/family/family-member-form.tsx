
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
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import PocketBase from "pocketbase"
import { useToast } from "@/components/ui/use-toast"
import { FamilyMember } from "@/types/family-member"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

const formSchema = z.object({
    name: z.string().min(1, "姓名不能为空"),
    relation: z.enum(["Father", "Mother", "Brother", "Sister", "Grandparent", "Other"]),
    // Accept string or number from input. Transform empty string to null.
    age: z.union([z.string(), z.number()]).optional().transform((val) => (val === "" ? null : Number(val))),
    health_status: z.string().optional(),
    occupation: z.string().optional(),
    income_contribution: z.boolean().default(false),
    notes: z.string().optional(),
})

interface FamilyMemberFormProps {
    beneficiaryId: string
    initialData?: FamilyMember
    onSuccess?: () => void
    onCancel?: () => void
}

export function FamilyMemberForm({ beneficiaryId, initialData, onSuccess, onCancel }: FamilyMemberFormProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            relation: (initialData?.relation as any) || "Father",
            age: initialData?.age ?? "", // Use empty string for undefined to verify valid input state
            health_status: initialData?.health_status || "",
            occupation: initialData?.occupation || "",
            income_contribution: initialData?.income_contribution || false,
            notes: initialData?.notes || "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            // Clean payload: remove nulls if necessary, or let PB handle it. 
            // PB expects fields to be presents. Logic: null is okay if field is nullable. 
            // Better to pass properly typed data.
            const payload = {
                ...values,
                age: values.age === null ? undefined : values.age, // Verify if PB allows null or expects omission
                beneficiary: beneficiaryId,
            }

            console.log("Submitting payload:", payload) // Debug log

            if (initialData?.id) {
                await pb.collection("family_members").update(initialData.id, payload)
                toast({ title: "Updated", description: "Family member updated successfully" })
            } else {
                await pb.collection("family_members").create(payload)
                toast({ title: "Created", description: "New family member added" })
            }
            onSuccess?.()
        } catch (e: any) {
            console.error("Submission error:", e)
            // Log precise error from PB
            const errDetails = e?.data?.data ? JSON.stringify(e.data.data) : e.message
            toast({
                title: "Error",
                description: `Failed to save: ${errDetails}`,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-md bg-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>姓名 Name</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="relation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>关系 Relation</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Father">父亲 Father</SelectItem>
                                        <SelectItem value="Mother">母亲 Mother</SelectItem>
                                        <SelectItem value="Brother">兄弟 Brother</SelectItem>
                                        <SelectItem value="Sister">姐妹 Sister</SelectItem>
                                        <SelectItem value="Grandparent">祖辈 Grandparent</SelectItem>
                                        <SelectItem value="Other">其他 Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>年龄 Age</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="health_status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>健康状况 Health</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 健康, 患病..." {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>职业 Occupation</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="income_contribution"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    家庭经济支柱 Income Contributor
                                </FormLabel>
                            </div>
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
                                <Textarea {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Member"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
