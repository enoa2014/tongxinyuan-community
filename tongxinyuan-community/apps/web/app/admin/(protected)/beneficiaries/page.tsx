
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import PocketBase from "pocketbase"
import { Trash2 } from "lucide-react"

// Type definition (minimal for list)
type Beneficiary = {
    id: string
    name: string
    gender: string
    birth_date?: string
    phone: string
    type: string
    status: string
    native_place?: string
    hometown?: string // Legacy
    treatment_stage: string
    created: string
}

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

export default function BeneficiariesPage() {
    const router = useRouter()
    const [allData, setAllData] = useState<Beneficiary[]>([]) // Store raw full data
    const [loading, setLoading] = useState(true)
    const [filterType, setFilterType] = useState("all")
    const [sortOrder, setSortOrder] = useState("-created")
    const [search, setSearch] = useState("")
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const handleDelete = async () => {
        if (!deleteId) return
        try {
            await pb.collection("beneficiaries").delete(deleteId)
            // Remove from local state
            setAllData(prev => prev.filter(item => item.id !== deleteId))
            setDeleteId(null)
            setIsDeleteOpen(false)
        } catch (e) {
            console.error("Delete failed:", e)
            alert("删除失败，请稍后重试")
        }
    }


    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        try {
            // Client-side implementation to avoid Proxy 400 Errors on sort params
            const result = await pb.collection("beneficiaries").getFullList<Beneficiary>({
                sort: "-created", // Initial default sort from server
            })
            setAllData(result)
        } catch (e) {
            console.error("Fetch error:", e)
        } finally {
            setLoading(false)
        }
    }

    // Process Data: Filter -> Search -> Sort
    const processedData = allData
        .filter(item => {
            // Type Filter
            if (filterType !== "all" && item.type !== filterType) return false
            // Search Filter
            if (search) {
                const q = search.toLowerCase()
                return item.name.toLowerCase().includes(q) || item.phone.includes(q)
            }
            return true
        })
        .sort((a, b) => {
            const getVal = (obj: Beneficiary, field: keyof Beneficiary) => obj[field] || ""

            // Sort Logic
            switch (sortOrder) {
                case "created": // Oldest Created First
                    return getVal(a, "created") > getVal(b, "created") ? 1 : -1
                case "-created": // Newest Created First
                    return getVal(b, "created") > getVal(a, "created") ? 1 : -1

                case "birth_date": // Age Max (Oldest Person) -> Earliest Birth Date
                    return (a.birth_date || "9999") > (b.birth_date || "9999") ? 1 : -1
                case "-birth_date": // Age Min (Youngest Person) -> Latest Birth Date
                    return (b.birth_date || "0000") > (a.birth_date || "0000") ? 1 : -1

                case "status,-updated": // Active First
                    if (a.status === b.status) return 0
                    return a.status === "active" ? -1 : 1

                default:
                    return 0
            }
        })

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "illness_child": return "大病患儿"
            case "girl_student": return "困境女童"
            default: return "其他" // Handle "other" or empty
        }
    }

    const getStageLabel = (stage: string) => {
        const map: Record<string, string> = {
            initial: "初诊/检查",
            chemo: "化疗中",
            transplant: "移植仓",
            rehab: "康复期",
            palliative: "安宁疗护",
            surgery: "手术治疗",
            followup: "定期随访"
        }
        return map[stage] || stage || "-"
    }

    const getGenderLabel = (g?: string) => {
        if (!g) return "-"
        if (g === "M" || g === "male" || g === "男") return "男"
        if (g === "F" || g === "female" || g === "女") return "女"
        return g
    }

    const calculateAge = (birthDateString?: string) => {
        if (!birthDateString) return "-"
        const birthDate = new Date(birthDateString)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return `${age}岁`
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">受助人档案</h1>
                    <p className="text-muted-foreground">
                        管理大病患儿及其他受助对象的详细档案。
                    </p>
                </div>
                <Button onClick={() => router.push("/admin/beneficiaries/new")}>
                    <Plus className="mr-2 h-4 w-4" /> 新建档案
                </Button>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="搜索姓名或电话..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px]">
                        <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="类型筛选" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">所有类型</SelectItem>
                        <SelectItem value="illness_child">大病患儿</SelectItem>
                        <SelectItem value="girl_student">困境女童</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="-created">最新录入 (默认)</SelectItem>
                        <SelectItem value="created">最早录入</SelectItem>
                        <SelectItem value="-birth_date">年龄最小 (Youngest)</SelectItem>
                        <SelectItem value="birth_date">年龄最大 (Oldest)</SelectItem>
                        <SelectItem value="status,-updated">状态 (在案优先)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>姓名</TableHead>
                            <TableHead>类型</TableHead>
                            <TableHead>性别/年龄</TableHead>
                            <TableHead>治疗阶段</TableHead>
                            <TableHead>籍贯</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">加载中...</TableCell>
                            </TableRow>
                        ) : processedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">暂无数据</TableCell>
                            </TableRow>
                        ) : (
                            processedData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getGenderLabel(item.gender)}
                                        {item.birth_date ? <span className="text-muted-foreground ml-1">/ {calculateAge(item.birth_date)}</span> : ""}
                                    </TableCell>
                                    <TableCell>{getStageLabel(item.treatment_stage)}</TableCell>
                                    <TableCell>{item.native_place || item.hometown || "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === "active" ? "default" : "secondary"}>
                                            {item.status === "active" ? "在案" : "归档"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/beneficiaries/${item.id}`}>详情</Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => {
                                                    setDeleteId(item.id)
                                                    setIsDeleteOpen(true)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除该档案？</AlertDialogTitle>
                        <AlertDialogDescription>
                            此操作无法撤销。这将永久删除该受助人及其关联的所有家庭成员和医疗记录。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            确认删除
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
