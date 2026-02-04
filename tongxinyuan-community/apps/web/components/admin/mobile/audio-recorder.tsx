"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Mic, Play, Square, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface AudioRecorderProps {
    onSave: (blob: Blob) => void
    onCancel: () => void
}

export function AudioRecorder({ onSave, onCancel }: AudioRecorderProps) {
    const { toast } = useToast()
    const [isRecording, setIsRecording] = useState(false)
    const [duration, setDuration] = useState(0)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
                setAudioBlob(blob)
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)

            // Start timer
            const startTime = Date.now()
            timerRef.current = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTime) / 1000))
            }, 1000)

        } catch (error) {
            console.error("Error accessing microphone:", error)
            toast({
                title: "无法访问麦克风",
                description: "请确保您已授予录音权限。",
                variant: "destructive",
            })
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
        }
    }

    const playRecording = () => {
        if (audioBlob) {
            if (!audioPlayerRef.current) {
                audioPlayerRef.current = new Audio(URL.createObjectURL(audioBlob))
                audioPlayerRef.current.onended = () => setIsPlaying(false)
            }
            audioPlayerRef.current.play()
            setIsPlaying(true)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <Card className="p-4 bg-slate-50 border-slate-200">
            <div className="flex flex-col items-center gap-4">
                <div className="text-2xl font-mono font-bold text-slate-700">
                    {formatTime(duration)}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    {!audioBlob ? (
                        !isRecording ? (
                            <Button
                                size="lg"
                                className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg"
                                onClick={startRecording}
                            >
                                <Mic className="h-8 w-8 text-white" />
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                className="h-16 w-16 rounded-full bg-slate-800 hover:bg-slate-900 animate-pulse"
                                onClick={stopRecording}
                            >
                                <Square className="h-6 w-6 text-white fill-current" />
                            </Button>
                        )
                    ) : (
                        // Review Mode
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 rounded-full border-2"
                                onClick={() => {
                                    setAudioBlob(null)
                                    setDuration(0)
                                }}
                            >
                                <Trash2 className="h-5 w-5 text-slate-500" />
                            </Button>

                            <Button
                                size="icon"
                                className="h-12 w-12 rounded-full bg-brand-green hover:bg-brand-green/90"
                                onClick={playRecording}
                                disabled={isPlaying}
                            >
                                {isPlaying ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Play className="h-5 w-5 fill-current" />
                                )}
                            </Button>

                            <Button
                                className="h-12 rounded-full px-6"
                                onClick={() => onSave(audioBlob)}
                            >
                                保存
                            </Button>
                        </div>
                    )}
                </div>

                <div className="text-xs text-slate-400">
                    {isRecording ? "正在录音..." : (audioBlob ? "录音完成" : "点击开始录音")}
                </div>

                {!isRecording && !audioBlob && (
                    <Button variant="ghost" size="sm" onClick={onCancel} className="text-slate-400">
                        取消
                    </Button>
                )}
            </div>
        </Card>
    )
}
