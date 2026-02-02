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

    async function handleGenerate() {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/seed", { method: "POST" })
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

    async function handleClear() {
        setClearing(true)
        setShowConfirm(false)
        try {
            const res = await fetch("/api/admin/seed", { method: "DELETE" })
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
        }
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
                <CardFooter className="flex justify-between border-t p-6 bg-slate-50/50">
                    <Button
                        variant="outline"
                        onClick={() => setShowConfirm(true)}
                        disabled={loading || clearing}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        {clearing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        清除测试数据
                    </Button>

                    <Button
                        onClick={handleGenerate}
                        disabled={loading || clearing}
                        className="bg-brand-green hover:bg-brand-green/90"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        生成 10 人测试数据
                    </Button>
                </CardFooter>
            </Card>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认清除测试数据？</AlertDialogTitle>
                        <AlertDialogDescription>
                            此操作将从数据库中永久删除所有名称以 "[Test]" 开头的受助人档案和志愿者申请。此操作无法撤销。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => { e.preventDefault(); handleClear(); }}
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
