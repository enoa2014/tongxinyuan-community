
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { pb } from "@/lib/pocketbase"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
    title: z.string().min(2, "标题至少需要2个字符"),
    description: z.string().min(5, "描述至少需要5个字符"),
    icon: z.string().min(1, "请选择图标"),
    color_theme: z.string().min(1, "请选择颜色主题"),
    order: z.coerce.number().default(0),
})

interface ServiceFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    service?: any // If present, edit mode
    onSuccess: () => void
}

export function ServiceFormDialog({
    open,
    onOpenChange,
    service,
    onSuccess,
}: ServiceFormDialogProps) {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        // Cast resolver to any to avoid strict type mismatch with z.coerce.number().default()
        // and RHF's expectation of optional fields.
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            icon: "heart_handshake",
            color_theme: "green",
            order: 0,
        },
    })

    // Reset form when service changes or dialog opens
    useEffect(() => {
        if (open) {
            if (service) {
                form.reset({
                    title: service.title,
                    description: service.description,
                    icon: service.icon,
                    color_theme: service.color_theme,
                    order: service.order || 0,
                })
            } else {
                form.reset({
                    title: "",
                    description: "",
                    icon: "heart_handshake",
                    color_theme: "green",
                    order: 0,
                })
            }
        }
    }, [open, service, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true)
            if (service) {
                // Edit mode
                await pb.collection('services').update(service.id, values)
                toast({ title: "服务更新成功" })
            } else {
                // Create mode
                await pb.collection('services').create(values)
                toast({ title: "服务创建成功" })
            }
            onSuccess()
            onOpenChange(false)
        } catch (error: any) {
            toast({
                title: "操作失败",
                description: error.message,
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
                    <DialogTitle>{service ? "编辑服务" : "新建服务"}</DialogTitle>
                    <DialogDescription>
                        {service ? "修改现有的服务展示信息。" : "添加展示在“社区中心”页面的新服务模块。"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>服务名称</FormLabel>
                                    <FormControl>
                                        <Input placeholder="例如：住宿服务" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>描述摘要</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="简要描述该服务的内容..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="order"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>排序权重 (数字越大越靠前)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>图标</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="选择图标" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="utensils">餐饮 (Utensils)</SelectItem>
                                                <SelectItem value="heart_handshake">关爱 (Handshake)</SelectItem>
                                                <SelectItem value="book_open">教育 (Book)</SelectItem>
                                                <SelectItem value="sun">希望 (Sun)</SelectItem>
                                                <SelectItem value="home">住宿 (Home)</SelectItem>
                                                <SelectItem value="smile">心理 (Smile)</SelectItem>
                                                <SelectItem value="users">社群 (Users)</SelectItem>
                                                <SelectItem value="star">特色 (Star)</SelectItem>
                                                <SelectItem value="gift">市集 (Gift)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color_theme"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>颜色主题</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="选择颜色" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="green">绿色 (Green)</SelectItem>
                                                <SelectItem value="yellow">黄色 (Yellow)</SelectItem>
                                                <SelectItem value="blue">蓝色 (Blue)</SelectItem>
                                                <SelectItem value="orange">橙色 (Orange)</SelectItem>
                                                <SelectItem value="red">红色 (Red)</SelectItem>
                                                <SelectItem value="purple">紫色 (Purple)</SelectItem>
                                                <SelectItem value="teal">青色 (Teal)</SelectItem>
                                                <SelectItem value="slate">灰色 (Slate)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {service ? "保存修改" : "立即创建"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
