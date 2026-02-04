"use client"

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
import { useTransition } from "react"
import { pb } from "@/lib/pocketbase"
import { useToast } from "@/hooks/use-toast"

interface DeleteResidentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    residentId: string
    residentName: string
    onSuccess?: () => void
}

export function DeleteResidentDialog({
    open,
    onOpenChange,
    residentId,
    residentName,
    onSuccess,
}: DeleteResidentDialogProps) {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    function onDelete() {
        startTransition(async () => {
            try {
                await pb.collection("residents").delete(residentId)
                toast({
                    title: "删除成功",
                    description: `居民 "${residentName}" 已被删除`,
                })
                onOpenChange(false)
                onSuccess?.()
            } catch (error) {
                toast({
                    title: "删除失败",
                    description: "操作无法完成，请重试",
                    variant: "destructive",
                })
                console.error(error)
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>确认删除居民？</AlertDialogTitle>
                    <AlertDialogDescription>
                        此操作无法撤销。居民 <strong>{residentName}</strong> 的档案将被永久删除，相关的服务记录可能会失去关联。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onOpenChange(false)}>取消</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            onDelete()
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isPending}
                    >
                        {isPending ? "删除中..." : "确认删除"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
