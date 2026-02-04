"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Mic, Image as ImageIcon, FileText, Clock, Play } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { DraftsResponse } from "@/types/pocketbase-types"
import { Loader2 } from "lucide-react"

export default function InboxPage() {
    const [drafts, setDrafts] = useState<DraftsResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

    useEffect(() => {
        loadDrafts()
    }, [])

    const loadDrafts = async () => {
        try {
            setLoading(true)
            const result = await pb.collection('drafts').getList<DraftsResponse>(1, 50)
            setDrafts(result.items)
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
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                    </div>
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
                                                    return format(new Date(draft.created), "MM-dd HH:mm", { locale: zhCN })
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
                                                    <Loader2 className="h-3 w-3 animate-spin" /> // Placeholder for pause/stop
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
                                    <Button variant="ghost" className="flex-1 rounded-none px-3 text-brand-green hover:bg-green-50 hover:text-green-700">
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
        </div>
    )
}
