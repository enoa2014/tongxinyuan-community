"use client"

import { useState } from "react"
import { Loader2, Trash2, Database, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

export function DataSeederCard() {
    const [loading, setLoading] = useState(false)
    const [clearing, setClearing] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const [targetClearUrl, setTargetClearUrl] = useState<string>("")

    async function handleGenerate(url: string) {
        setLoading(true)
        try {
            const res = await fetch(url, { method: "POST" })
            const data = await res.json()

            if (res.ok) {
                toast({
                    title: "生成成功",
                    description: data.message,
                })
            } else {
                throw new Error(data.error || "生成失败")
            }
        } catch (error: any) {
            toast({
                title: "操作失败",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    async function handleClear(url: string) {
        setClearing(true)
        setShowConfirm(false)
        try {
            const res = await fetch(url, { method: "DELETE" })
            const data = await res.json()

            if (res.ok) {
                toast({
                    title: "清除成功",
                    description: data.message,
                })
            } else {
                throw new Error(data.error || "清除失败")
            }
        } catch (error: any) {
            toast({
                title: "操作失败",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setClearing(false)
            setTargetClearUrl("")
        }
    }

    const handleConfirm = (url: string) => {
        setTargetClearUrl(url)
        setShowConfirm(true)
    }

    return (
        <div className="mt-8">
            <Card className="border-slate-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-slate-500" />
                        测试数据管理
                    </CardTitle>
                    <CardDescription>
                        快速生成或清除用于演示和测试的模拟数据。仅在开发环境或演示环境使用。
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md bg-amber-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-amber-800">注意事项</h3>
                                <div className="mt-2 text-sm text-amber-700">
                                    <p>生成的数据将包含 "[Test]" 前缀。清除操作将永久删除所有带此前缀的记录。请勿在生产环境随意操作。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 border-t p-6 bg-slate-50/50">
                    <div className="flex w-full justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">基础测试数据 (10人 + 住宿)</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleConfirm("/api/admin/seed")}
                                disabled={loading || clearing}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                size="sm"
                            >
                                {clearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                清除
                            </Button>
                            <Button
                                onClick={() => handleGenerate("/api/admin/seed")}
                                disabled={loading || clearing}
                                className="bg-brand-green hover:bg-brand-green/90"
                                size="sm"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                生成
                            </Button>
                        </div>
                    </div>

                    <div className="flex w-full justify-between items-center border-t pt-4 border-slate-200">
                        <span className="text-sm font-medium text-slate-700">公益透明 (捐赠公示)</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleConfirm("/api/admin/seed/donations")}
                                disabled={loading || clearing}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                size="sm"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                清除
                            </Button>
                            <Button
                                onClick={() => handleGenerate("/api/admin/seed/donations")}
                                disabled={loading || clearing}
                                className="bg-brand-green hover:bg-brand-green/90"
                                size="sm"
                            >
                                生成 (20条)
                            </Button>
                        </div>
                    </div>

                    <div className="flex w-full justify-between items-center border-t pt-4 border-slate-200">
                        <span className="text-sm font-medium text-slate-700">公益活动 (招募/进行/往期)</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleConfirm("/api/admin/seed/activities")}
                                disabled={loading || clearing}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                size="sm"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                清除
                            </Button>
                            <Button
                                onClick={() => handleGenerate("/api/admin/seed/activities")}
                                disabled={loading || clearing}
                                className="bg-brand-green hover:bg-brand-green/90"
                                size="sm"
                            >
                                生成 (8条)
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认清除测试数据？</AlertDialogTitle>
                        <AlertDialogDescription>
                            此操作将从数据库中永久删除所有名称以 "[Test]" 开头的记录。此操作无法撤销。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => { e.preventDefault(); handleClear(targetClearUrl); }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            确认清除
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
