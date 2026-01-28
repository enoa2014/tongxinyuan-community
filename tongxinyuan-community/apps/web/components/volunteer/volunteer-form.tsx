"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Users2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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

const formSchema = z.object({
    name: z.string().min(2, {
        message: "姓名至少需要 2 个字符",
    }),
    phone: z.string().regex(/^1[3-9]\d{9}$/, {
        message: "请输入有效的中国大陆手机号",
    }),
    level: z.string({
        required_error: "请选择志愿者类型",
    }),
    availability: z.string().optional(),
    reason: z.string().min(10, {
        message: "申请理由至少需要 10 个字符",
    }).optional(),
})

export function VolunteerForm() {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            availability: "",
            reason: "",
        },
    })

    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const { pb } = await import("@/lib/pocketbase")

            await pb.collection("volunteer_applications").create({
                name: values.name,
                phone: values.phone,
                skills: { level: values.level, availability: values.availability },
                motivation: values.reason,
                status: "pending"
            })

            toast({
                title: "✅ 申请提交成功！",
                description: "感谢您的爱心。我们的社工将在 3 个工作日内联系您。",
            })
            setOpen(false)
            form.reset()
        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "提交失败",
                description: "网络连接异常，请稍后重试或直接联系我们。",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full bg-brand-yellow text-slate-900 hover:bg-brand-yellow/90 font-bold">
                    <Users2 className="mr-2 h-5 w-5" /> 申请成为志愿者
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>加入同心源志愿者大家庭</DialogTitle>
                    <DialogDescription>
                        请填写您的基本信息，我们将根据您的技能为您匹配合适的服务岗位。
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>您的姓名</FormLabel>
                                        <FormControl>
                                            <Input placeholder="张三" {...field} />
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
                                        <FormLabel>手机号码</FormLabel>
                                        <FormControl>
                                            <Input placeholder="13800000000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>期望参与的服务类型</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="请选择..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="level1">Level 1: 普适型 (后勤、清洁)</SelectItem>
                                            <SelectItem value="level2">Level 2: 康乐型 (陪伴、游戏)</SelectItem>
                                            <SelectItem value="level3">Level 3: 专业型 (医护、法律、心理)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>为什么想加入我们？(简述)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="例如：我有幼教经验，希望能陪伴大病患儿阅读..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-brand-green text-white hover:bg-brand-green/90" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            确认提交申请
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
