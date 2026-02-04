"use client"

import { Button } from "@/components/ui/button"
import { Plus, Mic, Camera, FileText, X } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AudioRecorder } from "./audio-recorder"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { pb } from "@/lib/pocketbase"

export function QuickCaptureFAB() {
    const [isOpen, setIsOpen] = useState(false)
    const [activeMode, setActiveMode] = useState<"none" | "audio" | "text" | "photo">("none")
    const [noteContent, setNoteContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const getCurrentStaffId = () => {
        // Fallback or strict check depending on how you handle auth
        // We use 'users' collection ID if 'staff' is not strictly separate or if they share auth
        // Assuming current logged in user is the staff
        // Note: Admin (superuser) does not have an ID compatible with 'users' or 'staff' relations usually,
        // unless we relax the schema or login as a staff member.
        return pb.authStore.model?.id
    }

    // Handlers
    const handleSaveAudio = async (blob: Blob) => {
        try {
            setIsSubmitting(true)
            const staffId = getCurrentStaffId()
            if (!staffId) throw new Error("User not authenticated")

            const formData = new FormData()
            formData.append("type", "audio")
            formData.append("status", "pending")
            formData.append("staff", staffId)
            // Convert blob to file
            const file = new File([blob], `audio_${Date.now()}.webm`, { type: 'audio/webm' })
            formData.append("file", file)

            await pb.collection('drafts').create(formData)

            toast({ title: "录音已保存到收集箱" })
            setActiveMode("none")
            setIsOpen(false)
        } catch (error: any) {
            console.error("Save audio failed:", error)
            toast({
                title: "保存失败 (仅限员工账号)",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSaveText = async () => {
        if (!noteContent.trim()) return

        try {
            setIsSubmitting(true)
            const staffId = getCurrentStaffId()
            if (!staffId) throw new Error("User not authenticated")

            await pb.collection('drafts').create({
                type: "text",
                content: noteContent,
                status: "pending",
                staff: staffId
            })

            toast({ title: "笔记已保存到收集箱" })
            setNoteContent("")
            setActiveMode("none")
            setIsOpen(false)
        } catch (error: any) {
            console.error("Save text failed:", error)
            toast({
                title: "保存失败 (仅限员工账号)",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePhotoClick = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.capture = 'environment'
        input.onchange = async (e: any) => {
            const file = e.target.files[0]
            if (file) {
                try {
                    const staffId = getCurrentStaffId()
                    if (!staffId) {
                        toast({ title: "请先登录", variant: "destructive" })
                        return
                    }

                    const formData = new FormData()
                    formData.append("type", "photo")
                    formData.append("status", "pending")
                    formData.append("staff", staffId)
                    formData.append("file", file)

                    await pb.collection('drafts').create(formData)
                    toast({ title: "照片已保存到收集箱" })
                    setIsOpen(false)
                } catch (error: any) {
                    console.error("Upload photo failed", error)
                    toast({
                        title: "上传失败 (仅限员工账号)",
                        description: error.message,
                        variant: "destructive"
                    })
                }
            }
        }
        input.click()
    }

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Speed Dial Menu */}
            <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-4">
                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Button
                                    className="h-12 w-12 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600"
                                    onClick={() => handlePhotoClick()}
                                >
                                    <Camera className="h-5 w-5 text-white" />
                                </Button>
                                <span className="absolute right-14 top-3 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">拍照</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: 0.05 }}
                            >
                                <Button
                                    className="h-12 w-12 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600"
                                    onClick={() => {
                                        setIsOpen(false)
                                        setActiveMode("text")
                                    }}
                                >
                                    <FileText className="h-5 w-5 text-white" />
                                </Button>
                                <span className="absolute right-14 top-3 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">记事</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                <Button
                                    className="h-12 w-12 rounded-full shadow-lg bg-red-500 hover:bg-red-600"
                                    onClick={() => {
                                        setIsOpen(false)
                                        setActiveMode("audio")
                                    }}
                                >
                                    <Mic className="h-5 w-5 text-white" />
                                </Button>
                                <span className="absolute right-14 top-3 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">录音</span>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Main FAB */}
                <Button
                    size="icon"
                    className={`h-14 w-14 rounded-full shadow-xl transition-transform duration-200 ${isOpen ? "rotate-45 bg-slate-800" : "bg-brand-green"}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Plus className="h-6 w-6 text-white" />
                </Button>
            </div>

            {/* Audio Dialog */}
            <Dialog open={activeMode === "audio"} onOpenChange={() => !isSubmitting && setActiveMode("none")}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>语音备忘</DialogTitle>
                    </DialogHeader>
                    {isSubmitting ? (
                        <div className="flex justify-center py-8">保存中...</div>
                    ) : (
                        <AudioRecorder
                            onSave={handleSaveAudio}
                            onCancel={() => setActiveMode("none")}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Text Dialog */}
            <Dialog open={activeMode === "text"} onOpenChange={() => !isSubmitting && setActiveMode("none")}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>快速记事</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Textarea
                            placeholder="输入内容..."
                            className="min-h-[150px]"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setActiveMode("none")} disabled={isSubmitting}>取消</Button>
                            <Button onClick={handleSaveText} disabled={isSubmitting || !noteContent.trim()}>
                                {isSubmitting ? "保存中..." : "保存"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
