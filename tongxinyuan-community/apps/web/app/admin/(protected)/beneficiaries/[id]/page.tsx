
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import PocketBase from "pocketbase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Save, Trash, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

// Components (We will create these next)
import BeneficiaryProfileForm from "@/components/admin/beneficiary/profile-form"
// import FamilyGenogramList from "@/components/admin/beneficiary/family-genogram-list"
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
    const [loading, setLoading] = useState(!isNew)
    const [activeTab, setActiveTab] = useState("profile")

    useEffect(() => {
        if (isNew) {
            setData({}) // Empty data for new
            return
        }
        fetchData()
    }, [id])

    async function fetchData() {
        try {
            const record = await pb.collection("beneficiaries").getOne(id, {
                expand: "accommodation_records(beneficiary)" // Pre-expand relations if needed? Actually records refer to beneficiary. Reverse relation expand is 'accommodation_records_via_beneficiary'
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
                    <Button>
                        <Save className="mr-2 h-4 w-4" /> 保存档案
                    </Button>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>家庭网络与家系图</CardTitle>
                            <CardDescription>
                                管理家庭成员结构、职业、健康状况及主要照顾者。
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 border border-dashed rounded text-center text-muted-foreground">
                                Genogram Editor Placeholder
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                    <div className="p-4 border border-dashed rounded text-center text-muted-foreground">
                        Photo Wall & Privacy Settings Placeholder
                    </div>
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
