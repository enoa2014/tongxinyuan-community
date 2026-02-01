"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import PocketBase from "pocketbase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Save, Trash, Share2, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import BeneficiaryProfileForm from "@/components/admin/beneficiary/profile-form"
import { GenogramView } from "@/components/admin/family/genogram-view"
import { FamilyMemberForm } from "@/components/admin/family/family-member-form"
import { FamilyMember } from "@/types/family-member"
import { MediaGallery } from "@/components/admin/media/media-gallery"
import { MediaUpload } from "@/components/admin/media/media-upload"
import { BeneficiaryMedia } from "@/types/media"

// import PhotoWall from "@/components/admin/beneficiary/photo-wall"
// import DocumentManager from "@/components/admin/beneficiary/document-manager"
// import AccommodationHistory from "@/components/admin/beneficiary/accommodation-history"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

export default function BeneficiaryDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const id = params.id as string
    const isNew = id === "new"

    const [data, setData] = useState<any>(null)
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
    const [loading, setLoading] = useState(!isNew)
    const [activeTab, setActiveTab] = useState("profile")

    // Dialog state
    const [isFamilyDialogOpen, setIsFamilyDialogOpen] = useState(false)
    const [editingMember, setEditingMember] = useState<FamilyMember | undefined>(undefined)
    const [mediaItems, setMediaItems] = useState<BeneficiaryMedia[]>([])
    const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false)

    useEffect(() => {
        if (isNew) {
            setData({}) // Empty data for new
            return
        }
        fetchData()
        fetchFamilyMembers()
        fetchMedia() // Add this
    }, [id])

    async function fetchData() {
        try {
            const record = await pb.collection("beneficiaries").getOne(id, {
                expand: "accommodation_records(beneficiary)"
            })
            setData(record)
        } catch (e) {
            console.error(e)
            toast({ title: "加载失败", description: "无法找到该档案", variant: "destructive" })
            router.push("/admin/beneficiaries")
        } finally {
            setLoading(false)
        }
    }

    async function fetchFamilyMembers() {
        if (isNew) return
        try {
            const records = await pb.collection("family_members").getList<FamilyMember>(1, 50, {
                filter: `beneficiary="${id}"`,
                sort: '-created'
            })
            setFamilyMembers(records.items)
        } catch (e) {
            console.error("Failed to fetch family members", e)
        }
    }

    async function fetchMedia() {
        if (isNew) return
        try {
            const records = await pb.collection("beneficiary_media").getList<BeneficiaryMedia>(1, 50, {
                filter: `beneficiary="${id}"`,
                sort: '-created'
            })
            setMediaItems(records.items)
        } catch (e) {
            console.error("Failed to fetch media", e)
        }
    }

    if (loading) return <div className="p-8">加载中...</div>

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            {data?.name || "新建档案"}
                            {data?.status && (
                                <Badge variant={data.status === "active" ? "default" : "secondary"}>
                                    {data.status === "active" ? "在案" : "归档"}
                                </Badge>
                            )}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {data?.id ? `ID: ${data.id}` : "填写以下信息创建新档案"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {!isNew && (
                        <Button variant="outline">
                            <Share2 className="mr-2 h-4 w-4" /> 导出/分享
                        </Button>
                    )}
                    {/* The save button is mainly for the profile form now, but we keep it here for consistency if needed or remove it */}
                </div>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto">
                    <TabsTrigger value="profile">基础档案</TabsTrigger>
                    <TabsTrigger value="family" disabled={isNew}>家庭网络</TabsTrigger>
                    <TabsTrigger value="media" disabled={isNew}>影像/隐私</TabsTrigger>
                    <TabsTrigger value="files" disabled={isNew}>文档附件</TabsTrigger>
                    <TabsTrigger value="accommodation" disabled={isNew}>住宿记录</TabsTrigger>
                    <TabsTrigger value="activity" disabled={isNew}>活动轨迹</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>基础身份与医疗信息</CardTitle>
                            <CardDescription>
                                包括必要的身份验证信息、病情诊断及紧急联系人。
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BeneficiaryProfileForm initialData={data} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="family" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isFamilyDialogOpen} onOpenChange={(open) => {
                            setIsFamilyDialogOpen(open)
                            if (!open) setEditingMember(undefined)
                        }}>
                            <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setEditingMember(undefined)}>
                                    <Plus className="h-4 w-4 mr-2" /> 添加家庭成员 Add Member
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>{editingMember ? "编辑家庭成员 Edit Member" : "添加家庭成员 Add Member"}</DialogTitle>
                                    <DialogDescription>
                                        完善家庭支持网络信息。
                                    </DialogDescription>
                                </DialogHeader>
                                <FamilyMemberForm
                                    beneficiaryId={id}
                                    initialData={editingMember}
                                    onSuccess={() => {
                                        setIsFamilyDialogOpen(false)
                                        fetchFamilyMembers()
                                    }}
                                    onCancel={() => setIsFamilyDialogOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <GenogramView beneficiaryName={data?.name} familyMembers={familyMembers} />

                    <Card>
                        <CardHeader>
                            <CardTitle>成员列表 Member List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {familyMembers.map(member => (
                                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/10">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{member.name} <span className="text-muted-foreground text-sm">({member.relation})</span></span>
                                            <span className="text-xs text-muted-foreground">{member.age ? `${member.age}岁` : ''} {member.health_status ? `| ${member.health_status}` : ''} {member.occupation ? `| ${member.occupation}` : ''}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                setEditingMember(member)
                                                setIsFamilyDialogOpen(true)
                                            }}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={async () => {
                                                if (!confirm("确定要删除这位家庭成员吗？")) return
                                                try {
                                                    await pb.collection("family_members").delete(member.id)
                                                    toast({ title: "已删除", description: "家庭成员已移除" })
                                                    fetchFamilyMembers()
                                                } catch (e) {
                                                    toast({ title: "删除失败", description: "请稍后重试", variant: "destructive" })
                                                }
                                            }}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {familyMembers.length === 0 && (
                                    <div className="text-center text-muted-foreground py-4">暂无家庭成员记录</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Other Tabs content omitted/placeholders kept */}
                <TabsContent value="media" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-medium">影像资料 Photo Wall</h3>
                            <p className="text-sm text-muted-foreground">管理受助人的照片与证明材料。</p>
                        </div>
                        <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-2" /> 上传照片 Upload
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>上传照片 Upload Photo</DialogTitle>
                                    <DialogDescription>
                                        支持最大 5MB 的图片文件。若包含敏感信息，请勿设置为“公开”。
                                    </DialogDescription>
                                </DialogHeader>
                                <MediaUpload
                                    beneficiaryId={id}
                                    onSuccess={() => {
                                        setIsMediaDialogOpen(false)
                                        fetchMedia()
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <MediaGallery items={mediaItems} onRefresh={fetchMedia} />
                </TabsContent>

                <TabsContent value="files" className="space-y-4">
                    <div className="p-4 border border-dashed rounded text-center text-muted-foreground">
                        Documents Manager Placeholder
                    </div>
                </TabsContent>

                <TabsContent value="accommodation" className="space-y-4">
                    <div className="p-4 border border-dashed rounded text-center text-muted-foreground">
                        Accommodation History Placeholder
                    </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <div className="p-4 border border-dashed rounded text-center text-muted-foreground">
                        Activity Timeline Placeholder
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    )
}
