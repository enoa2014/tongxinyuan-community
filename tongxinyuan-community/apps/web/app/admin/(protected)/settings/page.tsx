"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { pb } from "@/lib/pocketbase"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { SiteSettingsResponse } from "@/types/pocketbase-types"

const settingsFormSchema = z.object({
    site_name: z.string().min(2, {
        message: "站点名称至少需要 2 个字符。",
    }),
    description: z.string().optional(),
    contact_phone: z.string().optional(),
    contact_email: z.string().email("请输入有效的邮箱地址。").optional().or(z.literal("")),
    announcement: z.string().optional(),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

type SiteSettingsModel = SiteSettingsResponse & {
    site_name?: string
    description?: string
    contact_phone?: string
    contact_email?: string
    announcement?: string
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "请稍后重试。"
}

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [settingsId, setSettingsId] = useState<string | null>(null)

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: {
            site_name: "",
            description: "",
            contact_phone: "",
            contact_email: "",
            announcement: "",
        },
    })

    useEffect(() => {
        async function loadSettings() {
            try {
                const result = await pb.collection("site_settings").getList<SiteSettingsModel>(1, 1)

                if (result.items.length === 0) {
                    return
                }

                const settings = result.items[0]
                setSettingsId(settings.id)
                form.reset({
                    site_name: settings.site_name || "",
                    description: settings.description || "",
                    contact_phone: settings.contact_phone || "",
                    contact_email: settings.contact_email || "",
                    announcement: settings.announcement || "",
                })
            } catch (error) {
                console.error("Failed to load settings:", error)
                toast({
                    title: "加载失败",
                    description: "无法加载全局设置，请检查网络或权限。",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        void loadSettings()
    }, [form])

    async function onSubmit(data: SettingsFormValues) {
        setIsLoading(true)
        try {
            if (settingsId) {
                await pb.collection("site_settings").update(settingsId, data)
            } else {
                const record = await pb.collection("site_settings").create(data)
                setSettingsId(record.id)
            }

            toast({
                title: "保存成功",
                description: "全局设置已更新。",
            })
        } catch (error: unknown) {
            console.error("Failed to save settings:", error)
            toast({
                title: "保存失败",
                description: getErrorMessage(error),
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">系统设置</h3>
                <p className="text-sm text-muted-foreground">
                    管理站点的全局配置，例如名称、联系方式和公告内容。
                </p>
            </div>
            <div className="border-t border-slate-200 pt-6" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
                    <FormField
                        control={form.control}
                        name="site_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>站点名称</FormLabel>
                                <FormControl>
                                    <Input placeholder="同心苑关爱中心" {...field} />
                                </FormControl>
                                <FormDescription>会显示在浏览器标题和页脚等位置。</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>站点描述</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="一句话介绍机构..." {...field} />
                                </FormControl>
                                <FormDescription>用于 SEO 和页面元信息展示。</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="contact_phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>联系电话</FormLabel>
                                    <FormControl>
                                        <Input placeholder="020-xxxxxxxx" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contact_email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>联系邮箱</FormLabel>
                                    <FormControl>
                                        <Input placeholder="contact@example.org" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="announcement"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>全局公告</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="例如：节假日期间服务时间调整通知..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>填写后，可在前台顶部展示统一公告。</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        保存更改
                    </Button>
                </form>
            </Form>
        </div>
    )
}
