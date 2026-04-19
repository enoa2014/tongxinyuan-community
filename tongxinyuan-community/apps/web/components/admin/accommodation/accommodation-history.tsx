"use client"

import { format } from "date-fns"
import PocketBase from "pocketbase"
import { ArrowRight, Edit, Hotel, Trash } from "lucide-react"

import { AccommodationRecord } from "@/types/accommodation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

interface AccommodationHistoryProps {
    items: AccommodationRecord[]
    onRefresh: () => void
    onEdit: (item: AccommodationRecord) => void
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

function getTypeBadge(type: AccommodationRecord["record_type"]): { text: string; variant: BadgeVariant } {
    switch (type) {
        case "Check-in":
            return { text: "入住", variant: "default" }
        case "Extension":
            return { text: "续住", variant: "secondary" }
        case "Check-out":
            return { text: "退宿", variant: "outline" }
        case "Transfer":
            return { text: "转房", variant: "secondary" }
        default:
            return { text: type, variant: "default" }
    }
}

function getPaymentBadge(status?: AccommodationRecord["payment_status"]): { text: string; variant: BadgeVariant } {
    switch (status) {
        case "paid":
            return { text: "Paid", variant: "default" }
        case "waived":
            return { text: "Waived", variant: "secondary" }
        default:
            return { text: "Pending", variant: "outline" }
    }
}

export function AccommodationHistory({ items, onRefresh, onEdit }: AccommodationHistoryProps) {
    const { toast } = useToast()

    async function handleDelete(id: string) {
        if (!confirm("确定要删除这条住宿记录吗？")) {
            return
        }

        try {
            await pb.collection("accommodation_records").delete(id)
            toast({ title: "已删除", description: "记录已移除。" })
            onRefresh()
        } catch {
            toast({ title: "删除失败", variant: "destructive" })
        }
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed bg-muted/10 p-8 text-muted-foreground">
                <Hotel className="mb-2 h-10 w-10 opacity-20" />
                <p>暂无住宿记录</p>
            </div>
        )
    }

    const sortedItems = [...items].sort((left, right) => new Date(right.start_date).getTime() - new Date(left.start_date).getTime())

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedItems.map((item) => {
                        const typeBadge = getTypeBadge(item.record_type)
                        const paymentBadge = getPaymentBadge(item.payment_status)

                        return (
                            <TableRow key={item.id}>
                                <TableCell className="font-mono text-sm">
                                    {format(new Date(item.start_date), "yyyy-MM-dd")}
                                    {item.end_date && (
                                        <>
                                            <span className="mx-1 text-muted-foreground">
                                                <ArrowRight className="inline h-3 w-3" />
                                            </span>
                                            {format(new Date(item.end_date), "yyyy-MM-dd")}
                                        </>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={typeBadge.variant}>{typeBadge.text}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">{item.room_number}</TableCell>
                                <TableCell className="font-medium">
                                    {typeof item.fee_amount === "number" ? `¥${item.fee_amount.toFixed(2)}` : "-"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={paymentBadge.variant}>{paymentBadge.text}</Badge>
                                </TableCell>
                                <TableCell className="max-w-[220px] truncate text-muted-foreground" title={item.notes}>
                                    {item.notes || item.waiver_reason || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
