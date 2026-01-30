"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

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
import { pb } from "@/lib/pocketbase"

const settingsFormSchema = z.object({
    site_name: z.string().min(2, {
        message: "网站名称至少需要2个字符。",
    }),
    description: z.string().optional(),
    contact_phone: z.string().optional(),
    contact_email: z.string().email("请输入有效的邮箱地址").optional().or(z.literal("")),
    announcement: z.string().optional(),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

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
                // Fetch the first (and only) settings record
                const result = await pb.collection('site_settings').getList(1, 1)

                if (result.items.length > 0) {
                    const settings = result.items[0]
                    setSettingsId(settings.id)
                    form.reset({
                        site_name: settings.site_name || "",
                        description: settings.description || "",
                        contact_phone: settings.contact_phone || "",
                        contact_email: settings.contact_email || "",
                        announcement: settings.announcement || "",
                    })
                } else {
                    // No settings found, create one if appropriate, or just leave blank for user to save new
                    console.log("No settings found, waiting for user to create.")
                }
            } catch (error) {
                console.error("Failed to load settings:", error)
                toast({
                    title: "加载配置失败",
                    description: "请检查网络连接或权限。",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        loadSettings()
    }, [form])

    async function onSubmit(data: SettingsFormValues) {
        setIsLoading(true)
        try {
            if (settingsId) {
                // Update existing
                await pb.collection('site_settings').update(settingsId, data)
            } else {
                // Create new
                const record = await pb.collection('site_settings').create(data)
                setSettingsId(record.id)
            }

            toast({
                title: "设置已保存",
                description: "全局配置已更新。",
            })
        } catch (error: any) {
            console.error("Failed to save settings:", error)
            toast({
                title: "保存失败",
                description: error.message || "请稍后重试。",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading && !settingsId && false) {
        // Optional: Full page loader if desired, but form loading state works too
        // Keeping it simple for now, using button loading state primarily
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">系统设置</h3>
                <p className="text-sm text-muted-foreground">
                    管理网站的全局配置，如标题、联系方式和公告。
                </p>
            </div>
            <div className="border-t border-slate-200 pt-6"></div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                    <FormField
                        control={form.control}
                        name="site_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>网站名称 (Site Name)</FormLabel>
                                <FormControl>
                                    <Input placeholder="同心源·关爱中心" {...field} />
                                </FormControl>
                                <FormDescription>
                                    这将显示在浏览器标题栏和页脚中。
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>网站描述 (Description)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="一句话介绍机构..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    用于 SEO 和元数据描述。
                                </FormDescription>
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
                                <FormLabel>全局公告 (Global Announcement)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="例如：春节期间服务暂停通知..." className="min-h-[100px]" {...field} />
                                </FormControl>
                                <FormDescription>
                                    如果填写，将在网站顶部显示公告横幅（需前台支持）。
                                </FormDescription>
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
