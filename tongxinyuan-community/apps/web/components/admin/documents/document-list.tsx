"use client"

import { useState } from "react"
import PocketBase from "pocketbase"
import { format } from "date-fns"
import { FileText, Download, Trash, File, FileSpreadsheet, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { BeneficiaryDocument } from "@/types/document"

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL)

interface DocumentListProps {
    items: BeneficiaryDocument[]
    onRefresh: () => void
}

export function DocumentList({ items, onRefresh }: DocumentListProps) {
    const { toast } = useToast()

    async function handleDelete(id: string) {
        try {
            await pb.collection("beneficiary_documents").delete(id)
            toast({ title: "Deleted", description: "Document removed" })
            onRefresh()
        } catch (e) {
            toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
        }
    }

    const getFileUrl = (item: BeneficiaryDocument) => {
        return `${process.env.NEXT_PUBLIC_PB_URL}/api/files/beneficiary_documents/${item.id}/${item.file}`
    }

    const getFileIcon = (filename: string) => {
        const ext = filename.split(".").pop()?.toLowerCase()
        if (["pdf"].includes(ext || "")) return <FileText className="h-4 w-4 text-red-500" />
        if (["doc", "docx"].includes(ext || "")) return <FileText className="h-4 w-4 text-blue-500" />
        if (["xls", "xlsx"].includes(ext || "")) return <FileSpreadsheet className="h-4 w-4 text-green-500" />
        if (["jpg", "jpeg", "png", "webp"].includes(ext || "")) return <ImageIcon className="h-4 w-4 text-purple-500" />
        return <File className="h-4 w-4 text-muted-foreground" />
    }

    if (items.length === 0) {
        return <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">暂无文档附件 No documents yet</div>
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>名称 Title</TableHead>
                        <TableHead>分类 Category</TableHead>
                        <TableHead>上传时间 Date</TableHead>
                        <TableHead className="text-right">操作 Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{getFileIcon(item.file)}</TableCell>
                            <TableCell className="font-medium">
                                <a
                                    href={getFileUrl(item)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline flex items-center gap-2"
                                >
                                    {item.title}
                                </a>
                            </TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.created ? format(new Date(item.created), "yyyy-MM-dd") : "N/A"}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <a href={getFileUrl(item)} target="_blank" rel="noopener noreferrer" title="Download/View">
                                            <Download className="h-4 w-4" />
                                        </a>
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" title="Delete">
                                                <Trash className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>确认删除？Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    此操作无法撤销。这将永久删除该文档。
                                                    This action cannot be undone.
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
