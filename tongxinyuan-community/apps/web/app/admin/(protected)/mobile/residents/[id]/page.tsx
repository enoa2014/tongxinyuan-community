"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Phone, MapPin, Tag, FileText, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { pb } from "@/lib/pocketbase"
import { ResidentsRecord, CaseNotesRecord } from "@/types/pocketbase-types"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { ProfileSkeleton } from "@/components/admin/mobile/profile-skeleton"

export default function ResidentProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const [resident, setResident] = useState<ResidentsRecord | null>(null)
    const [notes, setNotes] = useState<CaseNotesRecord[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            try {
                // 1. Load Resident
                const r = await pb.collection('residents').getOne<ResidentsRecord>(id)
                setResident(r)

                // 2. Load Case Notes
                const n = await pb.collection('case_notes').getList<CaseNotesRecord>(1, 20, {
                    filter: `resident = "${id}"`,
                    sort: '-date',
                    expand: 'staff'
                })
                setNotes(n.items)
            } catch (e) {
                console.error("Failed to load resident", e)
                // router.push('/admin/mobile') // Optional: redirect on error
            } finally {
                setLoading(false)
            }
        }
        if (id) loadData()
    }, [id])

    if (loading) {
        return <ProfileSkeleton />
    }

    if (!resident) {
        return <div className="p-8 text-center text-red-500">居民不存在</div>
    }

    return (
        <div className="flex flex-col min-h-screen pb-20 bg-slate-50">
            {/* 1. Header & Quick Info */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Link href="/admin/mobile">
                        <Button variant="ghost" size="icon" className="-ml-2">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-bold">居民档案</h1>
                </div>

                <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${resident.name}`} />
                        <AvatarFallback>{resident.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {resident.name}
                            <span className={`px-2 py-0.5 text-xs rounded-full ${resident.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {resident.status === 'active' ? '活跃' : '迁出'}
                            </span>
                        </h2>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {resident.tags?.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-100">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <a href={`tel:${resident.phone}`} className="flex items-center gap-2 p-2 bg-slate-50 rounded text-slate-700 active:bg-slate-100">
                        <Phone size={16} className="text-brand-main" />
                        {resident.phone || '无电话'}
                    </a>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded text-slate-700">
                        <MapPin size={16} className="text-brand-main" />
                        <span className="truncate">{resident.address || '无地址'}</span>
                    </div>
                </div>
            </div>

            {/* 2. Tabs: Service Records & Details */}
            <div className="mt-2 flex-1">
                <Tabs defaultValue="service" className="w-full">
                    <TabsList className="w-full bg-white rounded-none border-b h-12 p-0">
                        <TabsTrigger value="service" className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-brand-main data-[state=active]:text-brand-main">
                            服务记录
                        </TabsTrigger>
                        <TabsTrigger value="info" className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-brand-main data-[state=active]:text-brand-main">
                            详细资料
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="service" className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-slate-900">历史记录 ({notes.length})</h3>
                            {/* TODO: Link to add note for this resident specifically? */}
                        </div>

                        {notes.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 bg-white rounded-lg border border-dashed">
                                暂无服务记录
                            </div>
                        ) : (
                            notes.map(note => (
                                <Card key={note.id} className="overflow-hidden">
                                    <CardHeader className="p-3 bg-slate-50 border-b flex flex-row items-center justify-between space-y-0">
                                        <div className="text-sm font-medium text-slate-700">
                                            {format(new Date(note.date), "yyyy-MM-dd HH:mm", { locale: zhCN })}
                                        </div>
                                        <Badge variant="outline" className="bg-white text-xs font-normal">
                                            {note.type}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.content}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                                            <Avatar className="h-4 w-4">
                                                <AvatarFallback className="text-[8px]">社</AvatarFallback>
                                            </Avatar>
                                            {/* @ts-ignore expansion */}
                                            <span>{note.expand?.staff?.name || '社工'}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="info" className="p-4">
                        <Card>
                            <CardContent className="p-4 space-y-4">
                                <div>
                                    <label className="text-xs text-slate-500">身份证号</label>
                                    <div className="font-medium">{resident.id_card || '-'}</div>
                                </div>
                                <div className="border-t pt-4">
                                    <label className="text-xs text-slate-500">详细地址</label>
                                    <div className="font-medium">{resident.address || '-'}</div>
                                </div>
                                {/* Add more fields here */}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* FAB to Add Note for this Resident */}
            <div className="fixed right-4 bottom-24">
                <Button className="h-12 w-12 rounded-full shadow-lg bg-brand-main" size="icon">
                    <Plus className="h-6 w-6" />
                </Button>
            </div>
        </div>
    )
}
