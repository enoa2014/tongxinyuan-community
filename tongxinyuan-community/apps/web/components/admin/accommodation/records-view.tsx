"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import PocketBase from "pocketbase"

import { AccommodationRecord } from "@/types/accommodation"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

interface AccommodationRecordsViewProps {
    refreshKey?: number
}

type AccommodationRecordWithExpand = AccommodationRecord & {
    expand?: {
        beneficiary?: {
            id: string
            name?: string
        }
        unit?: {
            id: string
            name: string
        }
    }
}

function getPaymentBadge(status?: AccommodationRecord["payment_status"]) {
    switch (status) {
        case "paid":
            return { text: "Paid", variant: "default" as const }
        case "waived":
            return { text: "Waived", variant: "secondary" as const }
        default:
            return { text: "Pending", variant: "outline" as const }
    }
}

function getRecordTypeLabel(type: AccommodationRecord["record_type"]) {
    const labels: Record<AccommodationRecord["record_type"], string> = {
        "Check-in": "入住",
        "Extension": "续住",
        "Check-out": "退宿",
        "Transfer": "转房",
    }

    return labels[type]
}

export function AccommodationRecordsView({ refreshKey = 0 }: AccommodationRecordsViewProps) {
    const [records, setRecords] = useState<AccommodationRecordWithExpand[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadRecords() {
            setLoading(true)
            try {
                const result = await pb.collection("accommodation_records").getFullList<AccommodationRecordWithExpand>({
                    sort: "-start_date",
                    expand: "beneficiary,unit",
                })
                setRecords(result)
            } catch (error) {
                console.error("Failed to load accommodation records:", error)
                setRecords([])
            } finally {
                setLoading(false)
            }
        }

        void loadRecords()
    }, [refreshKey])

    if (loading) {
        return <div className="rounded-lg border bg-muted/10 p-8 text-center text-muted-foreground">Loading records...</div>
    }

    if (records.length === 0) {
        return <div className="rounded-lg border border-dashed bg-muted/10 p-8 text-center text-muted-foreground">No accommodation records yet.</div>
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Beneficiary</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Waiver</TableHead>
                        <TableHead>Notes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map((record) => {
                        const paymentBadge = getPaymentBadge(record.payment_status)

                        return (
                            <TableRow key={record.id}>
                                <TableCell className="font-mono text-sm">
                                    {format(new Date(record.start_date), "yyyy-MM-dd")}
                                    {record.end_date ? ` -> ${format(new Date(record.end_date), "yyyy-MM-dd")}` : ""}
                                </TableCell>
                                <TableCell className="font-medium">{record.expand?.beneficiary?.name || record.beneficiary}</TableCell>
                                <TableCell>{getRecordTypeLabel(record.record_type)}</TableCell>
                                <TableCell>{record.expand?.unit?.name || record.room_number}</TableCell>
                                <TableCell>{typeof record.fee_amount === "number" ? `¥${record.fee_amount.toFixed(2)}` : "-"}</TableCell>
                                <TableCell>
                                    <Badge variant={paymentBadge.variant}>{paymentBadge.text}</Badge>
                                </TableCell>
                                <TableCell className="max-w-[180px] truncate" title={record.waiver_reason}>
                                    {record.waiver_reason || "-"}
                                </TableCell>
                                <TableCell className="max-w-[220px] truncate text-muted-foreground" title={record.notes}>
                                    {record.notes || "-"}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
