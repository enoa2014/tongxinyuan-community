
"use client"

import { useEffect, useState } from "react"
import PocketBase from "pocketbase"
import { AccommodationUnitsRecord, AccommodationUnitsTypeOptions, AccommodationUnitsStatusOptions } from "@/types/pocketbase-types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus, Pencil, Trash2, Home, Layers, Bed } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

interface InventoryViewProps {
    // Optional props for selecting a unit
    onSelectUnit?: (unit: AccommodationUnitsRecord) => void

    // Administration actions
    onCreate?: (parent: AccommodationUnitsRecord | null, type?: AccommodationUnitsTypeOptions) => void
    onEdit?: (unit: AccommodationUnitsRecord) => void
    onDelete?: (unit: AccommodationUnitsRecord) => void
}

type HierarchyNode = AccommodationUnitsRecord & {
    children?: HierarchyNode[]
}

export function InventoryView({ onSelectUnit, onCreate, onEdit, onDelete }: InventoryViewProps) {
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
        } catch (e) {
            console.error("Failed to fetch units", e)
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

        // Handle rooms directly attached to building (no floor)
        const directRooms = units.filter(u => u.parent === buildingId && u.type === AccommodationUnitsTypeOptions.room)
            .map(room => ({
                ...room,
                children: units.filter(u => u.parent === room.id && u.type === AccommodationUnitsTypeOptions.bed)
            }))

        let hierarchyChildren = [...floors]

        if (directRooms.length > 0) {
            // Create a virtual floor for direct rooms
            hierarchyChildren.push({
                id: `virtual-floor-${building.id}`,
                name: "General / Direct Rooms",
                type: AccommodationUnitsTypeOptions.floor,
                // Partial mock of required fields
                collectionId: "",
                collectionName: "",
                created: "",
                updated: "",
                children: directRooms
            } as unknown as HierarchyNode)
        }

        return { ...building, children: hierarchyChildren }
    }

    if (loading) return <div>Loading Inventory...</div>

    const buildings = units.filter(u => u.type === AccommodationUnitsTypeOptions.building)
    const activeHierarchy = getBuildingHierarchy(selectedBuilding)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Tabs value={selectedBuilding} onValueChange={setSelectedBuilding} className="flex-1">
                    <TabsList className="h-auto flex-wrap">
                        {buildings.map(b => (
                            <div key={b.id} className="relative flex items-center group">
                                <TabsTrigger value={b.id} className="flex items-center gap-2 py-2 pr-8">
                                    <Home className="w-4 h-4" />
                                    {b.name}
                                </TabsTrigger>
                                {selectedBuilding === b.id && (
                                    <div className="absolute right-1 z-10">
                                        <UnitMenu
                                            unit={b}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                            onCreateChild={() => onCreate?.(b, AccommodationUnitsTypeOptions.floor)}
                                            childLabel="Add Floor"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        <Button variant="ghost" size="sm" onClick={() => onCreate?.(null, AccommodationUnitsTypeOptions.building)}>
                            <Plus className="w-4 h-4 mr-1" /> Add Building
                        </Button>
                    </TabsList>

                    {activeHierarchy?.children?.map(floor => (
                        <TabsContent key={floor.id} value={selectedBuilding} className="space-y-4 mt-6">
                            <div className="flex items-center justify-between border-b pb-2">
                                <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                                    <Layers className="w-5 h-5" />
                                    {floor.name}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" onClick={() => onCreate?.(floor, AccommodationUnitsTypeOptions.room)}>
                                        <Plus className="w-4 h-4 mr-1" /> Add Room
                                    </Button>
                                    {/* Don't allow deleting virtual floor */}
                                    {!floor.id.startsWith('virtual') && (
                                        <UnitMenu unit={floor} onEdit={onEdit} onDelete={onDelete} />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {floor.children?.map(room => (
                                    <Card key={room.id} className="overflow-hidden">
                                        <CardHeader className="bg-muted/30 pb-2">
                                            <CardTitle className="text-base flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span>{room.name}</span>
                                                    <Badge variant="outline" className="text-xs font-normal">
                                                        {(room as any).tags || "Standard"}
                                                    </Badge>
                                                </div>
                                                <UnitMenu
                                                    unit={room}
                                                    onEdit={onEdit}
                                                    onDelete={onDelete}
                                                    onCreateChild={() => onCreate?.(room, AccommodationUnitsTypeOptions.bed)}
                                                    childLabel="Add Bed"
                                                    minimal
                                                />
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
        </div>
    )
}

function UnitMenu({
    unit,
    onEdit,
    onDelete,
    onCreateChild,
    childLabel,
    minimal
}: {
    unit: AccommodationUnitsRecord
    onEdit?: (u: AccommodationUnitsRecord) => void
    onDelete?: (u: AccommodationUnitsRecord) => void
    onCreateChild?: () => void
    childLabel?: string
    minimal?: boolean
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {onCreateChild && (
                    <>
                        <DropdownMenuItem onClick={() => onCreateChild()}>
                            <Plus className="mr-2 h-4 w-4" /> {childLabel || "Add Child"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem onClick={() => onEdit?.(unit)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete?.(unit)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
