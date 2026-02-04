"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Mic, Image as ImageIcon, FileText, Clock, Play } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { DraftsResponse, ResidentsRecord } from "@/types/pocketbase-types"
import { Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResidentPicker } from "@/components/admin/mobile/resident-picker"
import { InboxSkeleton } from "@/components/admin/mobile/inbox-skeleton"
import { useToast } from "@/components/ui/use-toast"

export default function InboxPage() {
    const { toast } = useToast()
    const [drafts, setDrafts] = useState<DraftsResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

    // Processing State
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [processingDraft, setProcessingDraft] = useState<DraftsResponse | null>(null)
    const [processForm, setProcessForm] = useState({
        residentId: "",
        type: "上门探访",
        content: "",
        date: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        loadDrafts()
    }, [])

    const loadDrafts = async () => {
        try {
            setLoading(true)
            setLoading(true)
            // Fetch all and filter client-side to avoid PB 400 error
            // Fetch all and filter client-side to avoid PB 400 error
            // Sort removed due to PB 400 error on system field
            const result = await pb.collection('drafts').getList<DraftsResponse>(1, 50)
            // Filter locally
            const pendingItems = result.items.filter(item => item.status === 'pending')
            setDrafts(pendingItems)
        } catch (error) {
            console.error("Failed to load drafts", error)
        } finally {
            setLoading(false)
        }
    }

    const playAudio = (url: string, id: string) => {
        if (playingAudioId === id && audioElement) {
            audioElement.pause()
            setPlayingAudioId(null)
            return
        }

        if (audioElement) {
            audioElement.pause()
        }

        const audio = new Audio(url)
        audio.onended = () => setPlayingAudioId(null)
        audio.play()
        setAudioElement(audio)
        setPlayingAudioId(id)
    }

    const openProcessSheet = (draft: DraftsResponse) => {
        setProcessingDraft(draft)
        setProcessForm({
            residentId: "",
            type: "上门探访",
            content: draft.content || (draft.type === 'audio' ? '[语音记录转文字...]' : '[图片记录]'),
            date: format(new Date(), "yyyy-MM-dd")
        })
        setIsSheetOpen(true)
    }

    const handleProcess = async () => {
        if (!processForm.residentId) {
            toast({ title: "请选择居民", variant: "destructive" })
            return
        }

        setIsSubmitting(true)
        try {
            // 1. Create Case Note
            await pb.collection('case_notes').create({
                resident: processForm.residentId,
                staff: pb.authStore.model?.id,
                date: new Date(processForm.date),
                type: processForm.type,
                content: processForm.content,
                source_draft: processingDraft?.id,
            })

            // 2. Update Draft Status
            if (processingDraft) {
                await pb.collection('drafts').update(processingDraft.id, {
                    status: 'processed'
                })
            }

            toast({ title: "✅ 归档成功!" })
            setIsSheetOpen(false)
            loadDrafts()

        } catch (e) {
            console.error(e)
            toast({ title: "归档失败", description: "请重试", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col h-full space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/mobile">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-xl font-bold">收集箱 (Inbox)</h1>
                    <p className="text-xs text-slate-500">待处理的临时记录</p>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {loading ? (
                    <InboxSkeleton />
                ) : (
                    drafts.map(draft => (
                        <Card key={draft.id} className="overflow-hidden">
                            <CardContent className="p-0 flex">
                                {/* Icon Strip */}
                                <div className={`w-12 flex items-center justify-center ${draft.type === 'audio' ? 'bg-red-100 text-red-600' :
                                    draft.type === 'text' ? 'bg-orange-100 text-orange-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                    {draft.type === 'audio' && <Mic className="h-5 w-5" />}
                                    {draft.type === 'text' && <FileText className="h-5 w-5" />}
                                    {draft.type === 'photo' && <ImageIcon className="h-5 w-5" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-3 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {(() => {
                                                try {
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    return format(new Date((draft as any).created), "MM-dd HH:mm", { locale: zhCN })
                                                } catch (e) {
                                                    return "刚刚"
                                                }
                                            })()}
                                        </span>
                                    </div>

                                    {draft.type === 'audio' && draft.file && (
                                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 rounded-full bg-white shadow-sm flex-none"
                                                onClick={() => playAudio(pb.files.getUrl(draft, draft.file), draft.id)}
                                            >
                                                {playingAudioId === draft.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    <Play className="h-3 w-3 fill-current" />
                                                )}
                                            </Button>
                                            <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                                <div className={`h-full bg-red-400 ${playingAudioId === draft.id ? 'animate-pulse w-full' : 'w-0'}`} />
                                            </div>
                                        </div>
                                    )}

                                    {draft.type === 'text' && (
                                        <p className="text-sm text-slate-700 line-clamp-2 break-all">
                                            {draft.content}
                                        </p>
                                    )}

                                    {draft.type === 'photo' && draft.file && (
                                        <div className="relative h-20 w-20 rounded-md overflow-hidden bg-slate-100 mt-1">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={pb.files.getUrl(draft, draft.file, { thumb: '100x100' })}
                                                alt="Draft attachment"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="border-l flex flex-col">
                                    <Button
                                        variant="ghost"
                                        className="flex-1 rounded-none px-3 text-brand-green hover:bg-green-50 hover:text-green-700"
                                        onClick={() => openProcessSheet(draft)}
                                    >
                                        整理
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}

                {!loading && drafts.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        <p>没有待处理的记录</p>
                        <p className="text-sm">点击右下角 + 号开始记录</p>
                    </div>
                )}
            </div>

            {/* Process Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="bottom" className="h-[85vh] flex flex-col rounded-t-xl p-0">
                    <SheetHeader className="p-4 border-b">
                        <SheetTitle>整理归档</SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* 1. Resident */}
                        <div className="space-y-2">
                            <Label>关联居民</Label>
                            <ResidentPicker
                                onSelect={(r) => setProcessForm(prev => ({ ...prev, residentId: r ? r.id : "" }))}
                                selectedId={processForm.residentId}
                            />
                        </div>

                        {/* 2. Type */}
                        <div className="space-y-2">
                            <Label>服务类型</Label>
                            <Select
                                value={processForm.type}
                                onValueChange={(v) => setProcessForm(prev => ({ ...prev, type: v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="上门探访">上门探访</SelectItem>
                                    <SelectItem value="电话慰问">电话慰问</SelectItem>
                                    <SelectItem value="资源配送">资源配送</SelectItem>
                                    <SelectItem value="心理疏导">心理疏导</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 3. Date */}
                        <div className="space-y-2">
                            <Label>服务时间</Label>
                            <Input
                                type="date"
                                value={processForm.date}
                                onChange={(e) => setProcessForm(prev => ({ ...prev, date: e.target.value }))}
                            />
                        </div>

                        {/* 4. Content */}
                        <div className="space-y-2">
                            <Label>记录内容</Label>
                            <Textarea
                                value={processForm.content}
                                onChange={(e) => setProcessForm(prev => ({ ...prev, content: e.target.value }))}
                                rows={5}
                            />
                        </div>

                        {/* Attachment Hint */}
                        {processingDraft?.file && (
                            <div className="text-xs text-slate-400 bg-slate-50 p-2 rounded">
                                * 包含 1 个附件 ({processingDraft.type})，将自动关联到档案。
                            </div>
                        )}
                    </div>

                    <SheetFooter className="p-4 border-t bg-white flex flex-row gap-2 sm:justify-between">
                        <Button variant="outline" className="flex-1" onClick={() => setIsSheetOpen(false)}>
                            取消
                        </Button>
                        <Button className="flex-1 bg-brand-main" onClick={handleProcess} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            确认归档
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
