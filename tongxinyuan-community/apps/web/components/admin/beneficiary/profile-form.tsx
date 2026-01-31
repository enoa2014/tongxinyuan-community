
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/components/ui/use-toast"
import PocketBase from "pocketbase"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

const profileSchema = z.object({
    name: z.string().min(2, "姓名至少2个字"),
    gender: z.string().optional(),
    birth_date: z.date().optional(),
    id_card: z.string().optional(),
    hometown: z.string().optional(),
    phone: z.string().optional(),

    diagnosis: z.string().optional(),
    hospital: z.string().optional(),
    treatment_stage: z.string().optional(),

    guardian_name: z.string().optional(),
    guardian_relation: z.string().optional(),
    guardian_phone: z.string().optional(),

    type: z.string(),
    status: z.string(),
})

export default function BeneficiaryProfileForm({ initialData }: { initialData?: any }) {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: initialData?.name || "",
            gender: initialData?.gender || "",
            birth_date: initialData?.birth_date ? new Date(initialData.birth_date) : undefined,
            id_card: initialData?.id_card || "",
            hometown: initialData?.hometown || "",
            phone: initialData?.phone || "",

            diagnosis: initialData?.diagnosis || "",
            hospital: initialData?.hospital || "",
            treatment_stage: initialData?.treatment_stage || "initial",

            guardian_name: initialData?.guardian_name || "",
            guardian_relation: initialData?.guardian_relation || "",
            guardian_phone: initialData?.guardian_phone || "",

            type: initialData?.type || "illness_child",
            status: initialData?.status || "active",
        },
    })

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        console.log("Submitting form with values:", values)
        setLoading(true)
        try {
            const payload = {
                ...values,
                birth_date: values.birth_date ? values.birth_date.toISOString() : undefined,
            }
            console.log("Payload:", payload)

            if (initialData?.id) {
                await pb.collection("beneficiaries").update(initialData.id, payload)
                toast({ title: "更新成功", description: "档案基础信息已保存" })
            } else {
                const res = await pb.collection("beneficiaries").create(payload)
                console.log("Created successfully:", res)
                toast({ title: "创建成功", description: "新档案已建立" })
                router.push(`/admin/beneficiaries/${res.id}`)
            }
        } catch (e) {
            console.error("Submission failed:", e)
            toast({ title: "操作失败", description: "请检查网络或权限", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    if (!isMounted) {
        return <div className="p-8">Loading form...</div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log("Form errors:", errors))} className="space-y-8">

                {/* Section 1: Basic Identity */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground border-b pb-1">身份信息 Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>姓名 *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="受助人姓名" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>性别</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="选择性别" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="男">男</SelectItem>
                                            <SelectItem value="女">女</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="birth_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mt-2">
                                    <FormLabel>出生日期</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                            onChange={(e) => {
                                                const date = e.target.value ? new Date(e.target.value) : undefined;
                                                field.onChange(date);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="id_card"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>身份证号 (加密存储)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="仅社工可见" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="hometown"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>籍贯</FormLabel>
                                    <FormControl>
                                        <Input placeholder="省/市" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Section 2: Medical Context */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground border-b pb-1">医疗状况 Medical Context</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="diagnosis"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>诊断病种</FormLabel>
                                    <FormControl>
                                        <Input placeholder="如：急性淋巴细胞白血病" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="treatment_stage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>治疗阶段</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="当前阶段" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="initial">初诊/检查</SelectItem>
                                            <SelectItem value="chemo">化疗中</SelectItem>
                                            <SelectItem value="transplant">移植仓</SelectItem>
                                            <SelectItem value="rehab">康复期</SelectItem>
                                            <SelectItem value="palliative">安宁疗护</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="hospital"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>就诊医院</FormLabel>
                                <FormControl>
                                    <Input placeholder="如：医科大一附院" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Section 3: Guardian (Primary Contact) */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground border-b pb-1">第一联系人 Primary Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="guardian_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>监护人姓名</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="guardian_relation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>关系</FormLabel>
                                    <FormControl>
                                        <Input placeholder="如：父子" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>联系电话</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* System Fields */}
                <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-md">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>受助人归类</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="illness_child">大病患儿</SelectItem>
                                        <SelectItem value="girl_student">困境女童</SelectItem>
                                        <SelectItem value="other">其他</SelectItem>
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
                                <FormLabel>档案状态</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">在案</SelectItem>
                                        <SelectItem value="archived">归档</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? "保存中..." : "保存基础档案"}
                </Button>
            </form>
        </Form>
    )
}
