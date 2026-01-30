
import { useState } from "react"
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
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface ServiceDeleteAlertProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    serviceId: string | null
    onSuccess: () => void
}

export function ServiceDeleteAlert({
    open,
    onOpenChange,
    serviceId,
    onSuccess,
}: ServiceDeleteAlertProps) {
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!serviceId) return

        try {
            setLoading(true)
            await pb.collection('services').delete(serviceId)
            toast({ title: "服务已删除" })
            onSuccess()
            onOpenChange(false)
        } catch (error: any) {
            toast({
                title: "删除失败",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>确认删除该服务项目？</AlertDialogTitle>
                    <AlertDialogDescription>
                        此操作无法撤销。该服务将在“社区中心”前台页面中被移除。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        确认删除
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
