
"use client"

import { useEffect, useState } from "react"
import PocketBase from "pocketbase"
import { AccommodationUnitsRecord, AccommodationUnitsTypeOptions } from "@/types/pocketbase-types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bed, Home, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

interface InventoryViewProps {
    // Optional props for selecting a unit
    onSelectUnit?: (unit: AccommodationUnitsRecord) => void
}

export function InventoryView({ onSelectUnit }: InventoryViewProps) {
    const [units, setUnits] = useState<AccommodationUnitsRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedBuilding, setSelectedBuilding] = useState<string>("")

    useEffect(() => {
        fetchUnits()
    }, [])

    async function fetchUnits() {
        try {
            const result = await pb.collection("accommodation_units").getFullList<AccommodationUnitsRecord>({
                sort: 'name'
            })
            setUnits(result)

            // Set default building
            const buildings = result.filter(u => u.type === AccommodationUnitsTypeOptions.building)
            if (buildings.length > 0) {
                setSelectedBuilding(buildings[0].id)
            }
        } catch (error) {
            console.error("Failed to fetch units", error)
        } finally {
            setLoading(false)
        }
    }

    // Helper to build hierarchy for a specific building
    const getBuildingHierarchy = (buildingId: string) => {
        const building = units.find(u => u.id === buildingId)
        if (!building) return null

        const floors = units.filter(u => u.parent === buildingId && u.type === AccommodationUnitsTypeOptions.floor)
            .map(floor => ({
                ...floor,
                children: units.filter(u => u.parent === floor.id && u.type === AccommodationUnitsTypeOptions.room)
                    .map(room => ({
                        ...room,
                        children: units.filter(u => u.parent === room.id && u.type === AccommodationUnitsTypeOptions.bed)
                    }))
            }))

        return { ...building, children: floors }
    }

    if (loading) return <div>Loading Inventory...</div>

    const buildings = units.filter(u => u.type === AccommodationUnitsTypeOptions.building)
    const activeHierarchy = getBuildingHierarchy(selectedBuilding)

    return (
        <div className="space-y-6">
            <Tabs value={selectedBuilding} onValueChange={setSelectedBuilding}>
                <TabsList>
                    {buildings.map(b => (
                        <TabsTrigger key={b.id} value={b.id} className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            {b.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {activeHierarchy?.children?.map(floor => (
                    <TabsContent key={floor.id} value={selectedBuilding} className="space-y-4 mt-6">
                        <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground mb-4">
                            <Layers className="w-5 h-5" />
                            {floor.name}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {floor.children?.map(room => (
                                <Card key={room.id} className="overflow-hidden">
                                    <CardHeader className="bg-muted/30 pb-2">
                                        <CardTitle className="text-base flex justify-between items-center">
                                            <span>{room.name}</span>
                                            <Badge variant="outline" className="text-xs font-normal">
                                                {room.tags || "Standard"}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 grid grid-cols-2 gap-2">
                                        {room.children?.map(bed => (
                                            <Button
                                                key={bed.id}
                                                variant="outline"
                                                className={cn(
                                                    "h-auto py-3 flex flex-col gap-1 items-start justify-center border-l-4",
                                                    bed.status === "active" ? "border-l-green-500 hover:bg-green-50" : "",
                                                    bed.status === "occupied" ? "border-l-red-500 bg-red-50 hover:bg-red-100" : "",
                                                    bed.status === "maintenance" ? "border-l-gray-500 bg-gray-50" : ""
                                                )}
                                                onClick={() => onSelectUnit?.(bed)}
                                            >
                                                <div className="flex items-center gap-2 w-full">
                                                    <Bed className="w-4 h-4" />
                                                    <span className="font-medium">{bed.name.split('-').pop()}</span>
                                                </div>
                                                <span className={cn(
                                                    "text-xs px-1.5 py-0.5 rounded-full",
                                                    bed.status === "active" ? "bg-green-100 text-green-700" : "",
                                                    bed.status === "occupied" ? "bg-red-100 text-red-700" : "",
                                                    bed.status === "maintenance" ? "bg-gray-200 text-gray-700" : ""
                                                )}>
                                                    {bed.status === "active" ? "Available" : bed.status}
                                                </span>
                                            </Button>
                                        ))}
                                        {room.children?.length === 0 && (
                                            <div className="col-span-2 text-center text-xs text-muted-foreground py-2">
                                                No beds configured
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
