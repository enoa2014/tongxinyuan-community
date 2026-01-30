"use client"

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { SortableServiceItem } from "./sortable-service-item"

interface SortableServiceListProps {
    items: any[]
    onReorder: (newItems: any[]) => void
    onEdit: (service: any) => void
    onDelete: (service: any) => void
    iconMap: Record<string, any>
}

export function SortableServiceList({ items, onReorder, onEdit, onDelete, iconMap }: SortableServiceListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over?.id)

            const newItems = arrayMove(items, oldIndex, newIndex)
            onReorder(newItems)
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {items.map((item) => (
                        <SortableServiceItem
                            key={item.id}
                            id={item.id}
                            service={item}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            iconMap={iconMap}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}
