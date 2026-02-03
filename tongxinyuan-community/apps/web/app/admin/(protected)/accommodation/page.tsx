
"use client"

import { useState } from "react"
import { InventoryView } from "@/components/admin/accommodation/inventory-view"
import { CheckInDialog } from "@/components/admin/accommodation/check-in-dialog"
import { CheckOutDialog } from "@/components/admin/accommodation/check-out-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnitForm } from "@/components/admin/accommodation/unit-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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
import { Separator } from "@/components/ui/separator"
import { AccommodationUnitsRecord, AccommodationUnitsTypeOptions } from "@/types/pocketbase-types"
import { useToast } from "@/components/ui/use-toast"
import PocketBase from "pocketbase"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

export default function AccommodationPage() {
    const { toast } = useToast()
    const [selectedUnit, setSelectedUnit] = useState<AccommodationUnitsRecord | undefined>(undefined)
    const [isCheckInOpen, setIsCheckInOpen] = useState(false)
    const [isCheckOutOpen, setIsCheckOutOpen] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // Inventory CRUD State
    const [isUnitFormOpen, setIsUnitFormOpen] = useState(false)
    const [editingUnit, setEditingUnit] = useState<AccommodationUnitsRecord | undefined>(undefined)
    const [parentUnit, setParentUnit] = useState<AccommodationUnitsRecord | undefined>(undefined)
    const [createType, setCreateType] = useState<AccommodationUnitsTypeOptions | undefined>(undefined)

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deletingUnit, setDeletingUnit] = useState<AccommodationUnitsRecord | undefined>(undefined)


    const handleSelectUnit = (unit: AccommodationUnitsRecord) => {
        setSelectedUnit(unit)
        if (unit.status === "active") {
            setIsCheckInOpen(true)
        } else if (unit.status === "occupied") {
            setIsCheckOutOpen(true)
        }
    }

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1)
        setIsCheckInOpen(false)
        setIsCheckOutOpen(false)
        setIsUnitFormOpen(false)
        setSelectedUnit(undefined)
    }

    // CRUD Handlers
    const handleCreate = (parent: AccommodationUnitsRecord | null, type?: AccommodationUnitsTypeOptions) => {
        setEditingUnit(undefined)
        setParentUnit(parent || undefined)
        setCreateType(type)
        setIsUnitFormOpen(true)
    }

    const handleEdit = (unit: AccommodationUnitsRecord) => {
        setEditingUnit(unit)
        setParentUnit(undefined)
        setCreateType(undefined)
        setIsUnitFormOpen(true)
    }

    const handleDelete = (unit: AccommodationUnitsRecord) => {
        setDeletingUnit(unit)
        setIsDeleteOpen(true)
    }

    const confirmDelete = async () => {
        if (!deletingUnit) return
        try {
            await pb.collection("accommodation_units").delete(deletingUnit.id)
            toast({ title: "Deleted", description: "Unit deleted successfully" })
            setRefreshTrigger(prev => prev + 1)
        } catch (e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" })
        } finally {
            setIsDeleteOpen(false)
            setDeletingUnit(undefined)
        }
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">住宿管理 Accommodation System</h1>
                <p className="text-muted-foreground">
                    管理小家房源库存与入住记录。 Inventory & Occupancy Management.
                </p>
            </div>

            <Separator />

            <Tabs defaultValue="inventory" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="inventory">房源视图 Inventory</TabsTrigger>
                    <TabsTrigger value="records">入住记录 Records</TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-4">
                    <InventoryView
                        key={refreshTrigger}
                        onSelectUnit={handleSelectUnit}
                        onCreate={handleCreate}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </TabsContent>

                <TabsContent value="records">
                    <div className="flex items-center justify-center p-8 border border-dashed rounded-lg bg-muted/10 text-muted-foreground">
                        入住记录列表 (In Progress)
                    </div>
                </TabsContent>
            </Tabs>

            {/* Check-in/out Dialogs */}
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

            {/* Management Dialogs */}
            <Dialog open={isUnitFormOpen} onOpenChange={setIsUnitFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingUnit ? "Edit Unit" : "Create New Unit"}</DialogTitle>
                        <DialogDescription>
                            Configure accommodation inventory.
                        </DialogDescription>
                    </DialogHeader>
                    <UnitForm
                        initialData={editingUnit}
                        parentUnitId={parentUnit?.id}
                        fixedType={createType}
                        onSuccess={handleSuccess}
                        onCancel={() => setIsUnitFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{deletingUnit?.name}" and all its children (rooms/beds).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
