"use client"

import { useState } from "react"
import Image from "next/image"
import PocketBase from "pocketbase"
import { format } from "date-fns"
import { Trash, Maximize2, Lock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { BeneficiaryMedia } from "@/types/media"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

interface MediaGalleryProps {
    items: BeneficiaryMedia[]
    onRefresh: () => void
}

export function MediaGallery({ items, onRefresh }: MediaGalleryProps) {
    const { toast } = useToast()
    const [selectedImage, setSelectedImage] = useState<BeneficiaryMedia | null>(null)

    async function handleDelete(id: string) {
        // Confirmation is handled by AlertDialog
        try {
            await pb.collection("beneficiary_media").delete(id)
            toast({ title: "Deleted", description: "Photo removed" })
            onRefresh()
        } catch (e) {
            toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
        }
    }

    const getImageUrl = (item: BeneficiaryMedia) => {
        return `${process.env.NEXT_PUBLIC_PB_URL}/api/files/beneficiary_media/${item.id}/${item.file}`
    }

    if (items.length === 0) {
        return <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">暂无影像记录 No photos yet</div>
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item) => (
                <div key={item.id} className="group relative border rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-square relative bg-muted">
                        <Image
                            src={getImageUrl(item)}
                            alt={item.caption || "Beneficiary Photo"}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="icon" variant="secondary" className="h-8 w-8">
                                        <Maximize2 className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-black/90 border-none [&>button]:text-white/70 [&>button]:hover:text-white [&>button]:!ring-0 [&>button]:!ring-offset-0 [&>button]:!outline-none [&>button]:bg-black/20 [&>button]:hover:bg-black/40 [&>button]:rounded-full [&>button]:p-1 [&>button]:top-2 [&>button]:right-2">
                                    <DialogTitle className="sr-only">Photo Preview</DialogTitle>
                                    <div className="relative w-full h-[80vh]">
                                        <Image
                                            src={getImageUrl(item)}
                                            alt={item.caption || ""}
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                    {item.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 text-white text-center">
                                            {item.caption}
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="h-8 w-8"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>确认删除？Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            此操作无法撤销。这将永久从服务器删除此照片。
                                            This action cannot be undone. This will permanently delete the photo.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>取消 Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            确认删除 Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                            {item.is_public ? (
                                <Badge variant="secondary" className="bg-green-500/80 text-white hover:bg-green-600/80 backdrop-blur-sm shadow-sm h-6 px-1.5">
                                    <Globe className="w-3 h-3 mr-1" /> 公开
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm shadow-sm h-6 px-1.5">
                                    <Lock className="w-3 h-3 mr-1" /> 内部
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="p-2 text-sm space-y-1">
                        <div className="font-medium truncate" title={item.caption}>{item.caption || "未命名图片"}</div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{item.category}</span>
                            <span>{item.captured_date ? format(new Date(item.captured_date), "yyyy-MM-dd") : ""}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
