
"use client"

import { Button } from "@/components/ui/button"
import { Share2, Printer } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function NewsActions({ title }: { title: string }) {
    const { toast } = useToast()

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: window.location.href,
            }).catch(console.error)
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.href)
            toast({ title: "链接已复制", description: "可以发送给朋友了" })
        }
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                分享
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                打印
            </Button>
        </div>
    )
}
