"use client"

import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { pb } from "@/lib/pocketbase"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
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
import { useToast } from "@/hooks/use-toast"
import { residentFormSchema, ResidentFormValues } from "@/types/schemas"
import { ResidentsResponse } from "@/types/pocketbase-types"

interface ResidentSheetProps {
    children?: React.ReactNode
    resident?: ResidentsResponse | null
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onSuccess?: () => void
}

export function ResidentSheet({
    children,
    resident,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    onSuccess
}: ResidentSheetProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? setControlledOpen : setInternalOpen

    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()

    const defaultValues: Partial<ResidentFormValues> = {
        name: resident?.name || "",
        phone: resident?.phone || "",
        address: resident?.address || "",
        status: (resident?.status as any) || "active",
        tags: "", // Tags logic pending
    }

    const form = useForm<ResidentFormValues>({
        resolver: zodResolver(residentFormSchema),
        defaultValues,
    })

    // Reset form when resident prop changes
    useEffect(() => {
        if (open) {
            if (resident) {
                form.reset({
                    name: resident.name,
                    phone: resident.phone,
                    address: resident.address,
                    status: resident.status as any,
                    tags: "",
                })
            } else {
                form.reset({
                    name: "",
                    phone: "",
                    address: "",
                    status: "active",
                    tags: "",
                })
            }
        }
    }, [resident, form, open])

    async function onSubmit(data: ResidentFormValues) {
        startTransition(async () => {
            try {
                if (resident?.id) {
                    await pb.collection("residents").update(resident.id, data)
                    toast({
                        title: "居民已更新",
                        description: `已成功更新居民 ${data.name} 的信息`,
                    })
                } else {
                    await pb.collection("residents").create(data)
                    toast({
                        title: "居民已创建",
                        description: `已成功添加居民 ${data.name}`,
                    })
                }
                setOpen?.(false)
                onSuccess?.()
            } catch (error) {
                toast({
                    title: "请求失败",
                    description: "无法保存居民信息，请重试。",
                    variant: "destructive",
                })
                console.error(error)
            }
        })
    }

    const isEditing = !!resident

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {children && <SheetTrigger asChild>{children}</SheetTrigger>}
            <SheetContent className="sm:max-w-[425px]">
                <SheetHeader>
                    <SheetTitle>{isEditing ? "编辑居民" : "添加居民"}</SheetTitle>
                    <SheetDescription>
                        在此处{isEditing ? "修改" : "填写"}居民的档案信息。完成后点击保存。
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>姓名</FormLabel>
                                    <FormControl>
                                        <Input placeholder="请输入姓名" {...field} />
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
                                        <Input placeholder="输入手机号" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>状态</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="选择状态" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">活跃</SelectItem>
                                                <SelectItem value="inactive">非活跃</SelectItem>
                                                <SelectItem value="deceased">已故</SelectItem>
                                                <SelectItem value="unknown">未知</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>详细地址</FormLabel>
                                    <FormControl>
                                        <Input placeholder="楼栋 - 房间号" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SheetFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "保存中..." : "保存更改"}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
