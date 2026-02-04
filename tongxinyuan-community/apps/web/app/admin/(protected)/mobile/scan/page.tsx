"use client"

import { QrScanner } from "@/components/admin/mobile/qr-scanner"
import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { pb } from "@/lib/pocketbase"

export default function ScanPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [result, setResult] = useState<string | null>(null)

    const handleScanSuccess = async (decodedText: string) => {
        // Prevent simple duplicates if needed, but here we just update state
        setResult(decodedText)

        // 1. Try to route if it's a Resident ID
        // Assumption: QR code is just the ID or prefixed
        let residentId = decodedText
        if (decodedText.startsWith("RESIDENT:")) {
            residentId = decodedText.split(":")[1]
        }

        // Basic ID format check (PocketBase IDs are 15 chars)
        if (residentId.length === 15) {
            toast({ title: "🔍 识别到居民", description: "正在跳转..." })
            router.push(`/admin/mobile/residents/${residentId}`)
            return
        }

        // Mock Check-in / Processing UI for generic codes
        toast({
            title: "✅ 扫描成功",
            description: `内容: ${decodedText}`,
        })

        // Save to History (Drafts) -> Only for non-resident codes? 
        // Or maybe we still log it? Let's log generic scans.
        try {
            const userId = pb.authStore.model?.id
            if (userId) {
                await pb.collection('drafts').create({
                    type: 'text',
                    content: `[扫码] ${decodedText}`,
                    status: 'processed',
                    staff: userId
                })
                console.log("Scan history saved")
            }
        } catch (error) {
            console.error("Failed to save scan history", error)
        }
    }

    // Debug helper removed for production
    // useEffect(() => {
    //     // @ts-ignore
    //     window.simulateScan = handleScanSuccess
    // }, [router])

    // const handleSimulateScan = () => {
    //     handleScanSuccess(`USER:${Math.floor(Math.random() * 10000)}`)
    // }

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/mobile">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">扫一扫</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm space-y-4">
                    {!result ? (
                        <>
                            <QrScanner onScanSuccess={handleScanSuccess} />
                            {/* Dev Mock Button */}

                        </>
                    ) : (
                        <div className="text-center space-y-4 p-8 bg-green-50 rounded-lg border border-green-200">
                            <h2 className="text-xl font-bold text-green-700">扫描成功</h2>
                            <p className="font-mono text-sm break-all">{result}</p>
                            <Button onClick={() => setResult(null)} className="w-full">
                                再次扫描
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
