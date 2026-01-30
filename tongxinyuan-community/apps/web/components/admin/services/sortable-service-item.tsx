"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SortableServiceItemProps {
    id: string
    service: any
    onEdit: (service: any) => void
    onDelete: (service: any) => void
    iconMap: Record<string, any>
}

export function SortableServiceItem({ id, service, onEdit, onDelete, iconMap }: SortableServiceItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const IconComponent = iconMap[service.icon] || iconMap['help_circle']

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                    {/* Drag Handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                        <GripVertical className="h-5 w-5" />
                    </div>

                    {/* Icon */}
                    <div className={`p-2 rounded-md bg-slate-100`}>
                        {IconComponent && <IconComponent className="h-5 w-5 text-slate-600" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{service.title}</h3>
                            <Badge variant="outline" className={`
                                ${service.color_theme === 'green' ? 'border-green-200 bg-green-50 text-green-700' : ''}
                                ${service.color_theme === 'yellow' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' : ''}
                                ${service.color_theme === 'blue' ? 'border-blue-200 bg-blue-50 text-blue-700' : ''}
                                ${service.color_theme === 'orange' ? 'border-orange-200 bg-orange-50 text-orange-700' : ''}
                                ${service.color_theme === 'red' ? 'border-red-200 bg-red-50 text-red-700' : ''}
                                ${service.color_theme === 'purple' ? 'border-purple-200 bg-purple-50 text-purple-700' : ''}
                                ${service.color_theme === 'teal' ? 'border-teal-200 bg-teal-50 text-teal-700' : ''}
                                ${service.color_theme === 'slate' ? 'border-slate-200 bg-slate-50 text-slate-700' : ''}
                            `}>
                                {service.color_theme}
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-500 truncate">{service.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(service)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => onDelete(service)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
