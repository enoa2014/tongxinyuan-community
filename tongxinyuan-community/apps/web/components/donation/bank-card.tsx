"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface BankCardProps {
    bankName: string
    accountName: string
    accountNumber: string
}

export function BankCard({ bankName, accountName, accountNumber }: BankCardProps) {
    const { toast } = useToast()
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber)
        setCopied(true)
        toast({
            title: "已复制账号",
            description: "银行账号已复制到剪贴板",
        })
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Card className="w-full max-w-md border-brand-green/20 overflow-hidden">
            <div className="h-2 bg-brand-green"></div>
            <CardHeader className="bg-slate-50">
                <CardTitle className="text-xl text-slate-800">对公账户捐赠</CardTitle>
                <CardDescription>
                    适用于大额捐赠或企业汇款 (可开具捐赠票据)
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-1">
                    <span className="text-sm text-slate-500 font-medium">开户行</span>
                    <p className="text-lg font-semibold text-slate-800">{bankName}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-sm text-slate-500 font-medium">户名</span>
                    <p className="text-lg font-semibold text-slate-800">{accountName}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-sm text-slate-500 font-medium">账号</span>
                    <div className="flex items-center gap-2">
                        <p className="text-xl font-mono font-bold text-brand-green tracking-wider">{accountNumber}</p>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-slate-400" />}
                        </Button>
                    </div>
                </div>

                <div className="bg-brand-yellow/10 p-4 rounded-md text-sm text-orange-800 mt-4 border border-brand-yellow/30">
                    <strong>温馨提示：</strong> 转账时请备注“捐赠用途+联系方式”，以便我们为您寄送捐赠证书。
                </div>
            </CardContent>
        </Card>
    )
}
