"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setIsVisible(true)
        }

        window.addEventListener("beforeinstallprompt", handler)
        return () => window.removeEventListener("beforeinstallprompt", handler)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === "accepted") {
            setDeferredPrompt(null)
        }
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-20 left-4 right-4 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                        <Download className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">安装应用</h3>
                        <p className="text-xs text-slate-300">添加到主屏幕以获得更好体验</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
                        onClick={() => setIsVisible(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                    <Button
                        size="sm"
                        className="bg-brand-main text-white hover:bg-brand-dark h-8 text-xs px-3"
                        onClick={handleInstall}
                    >
                        安装
                    </Button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
