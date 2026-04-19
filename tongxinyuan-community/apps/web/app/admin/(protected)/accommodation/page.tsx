"use client"

import { useState } from "react"

import { InventoryView } from "@/components/admin/accommodation/inventory-view"
import { CheckInDialog } from "@/components/admin/accommodation/check-in-dialog"
import { CheckOutDialog } from "@/components/admin/accommodation/check-out-dialog"
import { AccommodationRecordsView } from "@/components/admin/accommodation/records-view"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccommodationUnitsRecord } from "@/types/pocketbase-types"

export default function AccommodationPage() {
    const [selectedUnit, setSelectedUnit] = useState<AccommodationUnitsRecord | undefined>(undefined)
    const [isCheckInOpen, setIsCheckInOpen] = useState(false)
    const [isCheckOutOpen, setIsCheckOutOpen] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const handleSelectUnit = (unit: AccommodationUnitsRecord) => {
        setSelectedUnit(unit)

        if (unit.status === "active") {
            setIsCheckInOpen(true)
            return
        }

        if (unit.status === "occupied") {
            setIsCheckOutOpen(true)
        }
    }

    const handleSuccess = () => {
        setRefreshTrigger((previousValue) => previousValue + 1)
        setIsCheckInOpen(false)
        setIsCheckOutOpen(false)
        setSelectedUnit(undefined)
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">住宿管理 Accommodation System</h1>
                <p className="text-muted-foreground">
                    管理房源库存、入住记录和住宿费用状态。
                </p>
            </div>

            <Separator />

            <Tabs defaultValue="inventory" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="inventory">房源视图 Inventory</TabsTrigger>
                    <TabsTrigger value="records">入住记录 Records</TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-4">
                    <InventoryView key={refreshTrigger} onSelectUnit={handleSelectUnit} />
                </TabsContent>

                <TabsContent value="records">
                    <AccommodationRecordsView refreshKey={refreshTrigger} />
                </TabsContent>
            </Tabs>

            <CheckInDialog
                open={isCheckInOpen}
                onOpenChange={setIsCheckInOpen}
                initialUnit={selectedUnit}
                onSuccess={handleSuccess}
            />

            <CheckOutDialog
                open={isCheckOutOpen}
                onOpenChange={setIsCheckOutOpen}
                unit={selectedUnit}
                onSuccess={handleSuccess}
            />
        </div>
    )
}
