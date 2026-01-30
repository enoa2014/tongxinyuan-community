
"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, Utensils, HeartHandshake, BookOpen, Sun, HelpCircle, Home, Smile, Users, Star, Gift, ArrowUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { pb } from "@/lib/pocketbase"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { SortableServiceList } from "@/components/admin/services/sortable-service-list"

// Reusing the map for display
const ICON_MAP: Record<string, any> = {
    utensils: Utensils,
    heart_handshake: HeartHandshake,
    book_open: BookOpen,
    sun: Sun,
    home: Home,
    smile: Smile,
    users: Users,
    star: Star,
    gift: Gift
};

import { ServiceFormDialog } from "@/components/admin/services/service-form-dialog"
import { ServiceDeleteAlert } from "@/components/admin/services/service-delete-alert"

export default function ServicesAdminPage() {
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Dialog States
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedService, setSelectedService] = useState<any>(null)

    useEffect(() => {
        loadServices()
    }, [])

    async function loadServices() {
        try {
            setLoading(true)
            // Disable cache to see updates immediately
            const records = await pb.collection('services').getList(1, 50)
            // Sort client-side by order desc, then created desc
            const sortedItems = records.items.sort((a, b) => {
                const orderDiff = (b.order || 0) - (a.order || 0);
                if (orderDiff !== 0) return orderDiff;
                return new Date(b.created).getTime() - new Date(a.created).getTime();
            })
            setServices(sortedItems)
        } catch (e: any) {
            console.error("Failed to load services:", e)
            if (e.data) console.error("Error details:", e.data)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (service: any) => {
        setSelectedService(service)
        setIsEditOpen(true)
    }

    const handleDelete = (service: any) => {
        setSelectedService(service)
        setIsDeleteOpen(true)
    }

    const handleReorder = async (newItems: any[]) => {
        // 1. Assign new order values to the items based on their new position
        const total = newItems.length
        const updatedItems = newItems.map((item, index) => ({
            ...item,
            order: total - index
        }))

        // 2. Optimistic update with the NEW order values
        setServices(updatedItems)

        try {
            // 3. Batch update to backend
            const promises = updatedItems.map((item) => {
                // We compare with the *original* item's order to minimize requests, 
                // but since we only have the new object here, we implicitly check if the logic changed it.
                // Actually, the 'item' in 'newItems' (before map) had the OLD order.
                // But we constructed a new object. 
                // Let's just update everything or check effectively.
                // Simple approach: Update all. Or check if we really need to.
                // To check, we need the old value. 
                // 'newItems' elements are same refs as old state. 
                // So: if (newItems[index].order !== updatedItems[index].order)

                const originalItem = newItems.find(i => i.id === item.id);
                if (originalItem && originalItem.order !== item.order) {
                    return pb.collection('services').update(item.id, { order: item.order }, { requestKey: null })
                }
                return Promise.resolve()
            })

            await Promise.all(promises)
            toast({ title: "顺序已保存" })
        } catch (e) {
            console.error("Reorder failed:", e)
            toast({ title: "排序保存失败", variant: "destructive" })
            loadServices() // Revert
        }
    }

    if (loading && services.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">服务项目管理</h2>
                    <p className="text-slate-500 mt-2">管理社区中心对外展示的核心服务模块。</p>
                </div>
                <Button
                    className="bg-brand-green hover:bg-brand-green/90"
                    onClick={() => setIsCreateOpen(true)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    新建服务
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>现有服务 ({services.length})</CardTitle>
                    <CardDescription>
                        当前前台页面展示的服务列表。拖拽可调整顺序。
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SortableServiceList
                        items={services}
                        onReorder={handleReorder}
                        onEdit={(service) => {
                            setSelectedService(service)
                            setIsEditOpen(true)
                        }}
                        onDelete={handleDelete}
                        iconMap={ICON_MAP}
                    />
                </CardContent>
            </Card >

            {/* Dialogs */}
            < ServiceFormDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSuccess={loadServices}
            />

            <ServiceFormDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                service={selectedService}
                onSuccess={loadServices}
            />

            <ServiceDeleteAlert
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                serviceId={selectedService?.id}
                onSuccess={loadServices}
            />
        </div >
    )
}
