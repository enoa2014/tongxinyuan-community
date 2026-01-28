"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, CalendarHeart } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
    contactName: z.string().min(2, {
        message: "联系人姓名至少需要 2 个字符",
    }),
    phone: z.string().regex(/^1[3-9]\d{9}$/, {
        message: "请输入有效的中国大陆手机号",
    }),
    patientInfo: z.string().min(2, {
        message: "患儿情况描述",
    }).optional(),
    needs: z.string().min(5, {
        message: "请简要描述您的需求",
    }),
})

interface ServiceInquiryDialogProps {
    serviceTitle: string
}

export function ServiceInquiryDialog({ serviceTitle }: ServiceInquiryDialogProps) {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contactName: "",
            phone: "",
            patientInfo: "",
            needs: "",
        },
    })

    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const { pb } = await import("@/lib/pocketbase")

            await pb.collection("service_consultations").create({
                name: values.contactName,
                phone: values.phone,
                service_type: serviceTitle,
                description: `Patient Info: ${values.patientInfo || 'N/A'}\nNeeds: ${values.needs}`,
                status: "pending"
            })

            toast({
                title: "✅ 需求提交成功",
                description: "社工已收到您的需求，将尽快电话联系您确认。",
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
                <Button variant="outline" className="w-full mt-4 border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                    <CalendarHeart className="mr-2 h-4 w-4" /> 咨询 / 预约
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>预约服务: {serviceTitle}</DialogTitle>
                    <DialogDescription>
                        请留下您的联系方式，我们将有专人对接您的需求。（本服务完全免费）
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>家长/联系人姓名</FormLabel>
                                    <FormControl>
                                        <Input placeholder="王先生/女士" {...field} />
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
                                    <FormLabel>电话 (仅用于回访)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="138xxxx" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="needs"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>您的具体需求 (如时间、人数)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="例如：想预约本周六中午的爱心厨房..."
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
                            提交需求
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
