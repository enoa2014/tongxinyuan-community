
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
import PocketBase from "pocketbase"

// Type definition (minimal for list)
type Beneficiary = {
    id: string
    name: string
    gender: string
    phone: string
    type: string
    status: string
    hometown: string
    treatment_stage: string
    created: string
}

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

export default function BeneficiariesPage() {
    const router = useRouter()
    const [data, setData] = useState<Beneficiary[]>([])
    const [loading, setLoading] = useState(true)
    const [filterType, setFilterType] = useState("all")
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchData()
    }, [filterType])

    async function fetchData() {
        setLoading(true)
        try {
            let filter = ""
            if (filterType !== "all") {
                filter += `type = "${filterType}"`
            }

            const result = await pb.collection("beneficiaries").getList<Beneficiary>(1, 50, {
                sort: "-created",
                filter: filter,
            })
            setData(result.items)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    // Client-side search for simplicity in this version
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.includes(search)
    )

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "illness_child": return "大病患儿"
            case "girl_student": return "困境女童"
            default: return "其他"
        }
    }

    const getStageLabel = (stage: string) => {
        const map: Record<string, string> = {
            initial: "初诊/检查",
            chemo: "化疗中",
            transplant: "移植仓",
            rehab: "康复期",
            palliative: "安宁疗护"
        }
        return map[stage] || stage || "-"
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

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
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
                    <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="类型筛选" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">所有类型</SelectItem>
                        <SelectItem value="illness_child">大病患儿</SelectItem>
                        <SelectItem value="girl_student">困境女童</SelectItem>
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
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">暂无数据</TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                                    </TableCell>
                                    <TableCell>{item.gender}</TableCell>
                                    <TableCell>{getStageLabel(item.treatment_stage)}</TableCell>
                                    <TableCell>{item.hometown || "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === "active" ? "default" : "secondary"}>
                                            {item.status === "active" ? "在案" : "归档"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/beneficiaries/${item.id}`}>查看详情</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
