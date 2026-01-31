
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Search, CheckCircle2, Clock, XCircle } from "lucide-react"

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { checkApplicationStatus } from "./actions"

const formSchema = z.object({
    phone: z.string().min(11, "请输入11位手机号").max(11, "手机号格式不正确").regex(/^1[3-9]\d{9}$/, "请输入有效的手机号"),
})

export default function CheckStatusPage() {
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        setError(null)
        setResult(null)
        try {
            const res = await checkApplicationStatus(values.phone)
            if (res.success) {
                setResult(res.data)
            } else {
                setError(res.error || "查询失败")
            }
        } catch (e) {
            setError("网络错误，请稍后重试")
        } finally {
            setLoading(false)
        }
    }

    const renderStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
            case 'approved':
                return <CheckCircle2 className="h-12 w-12 text-green-500" />
            case 'pending':
            case 'review':
                return <Clock className="h-12 w-12 text-blue-500" />
            case 'rejected':
            case 'archived':
                return <XCircle className="h-12 w-12 text-gray-400" />
            default:
                return <Clock className="h-12 w-12 text-gray-400" />
        }
    }

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            'active': '已通过 / 活跃中',
            'archived': '已归档',
            'deceased': '已结案',
            'pending': '审核中',
            'review': '复核中',
            'rejected': '未通过'
        }
        return map[status] || status || '状态未知'
    }

    return (
        <div className="container max-w-md py-20 mx-auto min-h-[60vh] flex flex-col justify-center">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 text-brand-blue">申请进度查询</h1>
                <p className="text-muted-foreground">输入申请时填写的手机号查询审核状态</p>
            </div>

            <Card className="w-full shadow-lg">
                <CardHeader>
                    <CardTitle>查询信息</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="请输入11位手机号" className="pl-9" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                立即查询
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {error && (
                <Card className="mt-6 border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-center text-red-600">
                        {error}
                        <div className="mt-2 text-sm text-muted-foreground">如需帮助请联系客服：010-12345678</div>
                    </CardContent>
                </Card>
            )}

            {result && (
                <Card className="mt-6 border-green-200 bg-green-50 animate-in fade-in slide-in-from-bottom-4">
                    <CardContent className="pt-8 pb-6 flex flex-col items-center">
                        <div className="mb-4">
                            {renderStatusIcon(result.status)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{result.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">申请类别: {result.category}</p>

                        <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium">
                            当前状态: <span className="text-brand-blue ml-1">{getStatusLabel(result.status)}</span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
