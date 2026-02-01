
"use client"

import { AccommodationRecord } from "@/types/accommodation"
import { format } from "date-fns"
import { Edit, Trash, Hotel, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import PocketBase from "pocketbase"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

interface AccommodationHistoryProps {
    items: AccommodationRecord[]
    onRefresh: () => void
    onEdit: (item: AccommodationRecord) => void
}

export function AccommodationHistory({ items, onRefresh, onEdit }: AccommodationHistoryProps) {
    const { toast } = useToast()

    async function handleDelete(id: string) {
        if (!confirm("确定要删除这条住宿记录吗？")) return
        try {
            await pb.collection("accommodation_records").delete(id)
            toast({ title: "已删除", description: "记录已移除" })
            onRefresh()
        } catch (e) {
            toast({ title: "删除失败", variant: "destructive" })
        }
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md text-muted-foreground bg-muted/10">
                <Hotel className="h-10 w-10 mb-2 opacity-20" />
                <p>暂无住宿记录 No records yet</p>
            </div>
        )
    }

    // Sort by start_date desc
    const sortedItems = [...items].sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())

    const getTypeColor = (type: string) => {
        switch (type) {
            case "Check-in": return "default"
            case "Extension": return "secondary"
            case "Check-out": return "outline"
            case "Transfer": return "secondary"
            default: return "default"
        }
    }

    const getTypeText = (type: string) => {
        const map: Record<string, string> = {
            "Check-in": "入住",
            "Extension": "续住",
            "Check-out": "退房",
            "Transfer": "转房"
        }
        return map[type] || type
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>日期 Date</TableHead>
                        <TableHead>类型 Type</TableHead>
                        <TableHead>房间 Room</TableHead>
                        <TableHead>备注 Notes</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-mono text-sm">
                                {format(new Date(item.start_date), "yyyy-MM-dd")}
                                {item.end_date && (
                                    <>
                                        <span className="mx-1 text-muted-foreground"><ArrowRight className="inline h-3 w-3" /></span>
                                        {format(new Date(item.end_date), "yyyy-MM-dd")}
                                    </>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant={getTypeColor(item.record_type) as any}>
                                    {getTypeText(item.record_type)}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{item.room_number}</TableCell>
                            <TableCell className="max-w-[200px] truncate text-muted-foreground" title={item.notes}>
                                {item.notes || "-"}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
