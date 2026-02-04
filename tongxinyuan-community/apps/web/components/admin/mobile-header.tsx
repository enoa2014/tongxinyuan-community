"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export function MobileHeader() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-slate-900 px-4 text-white lg:hidden">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-slate-800 text-white">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 border-r-slate-800 bg-slate-900 text-white">
                        <AdminSidebar />
                    </SheetContent>
                </Sheet>
                <span className="font-bold text-lg">同心源·工作台</span>
            </div>
        </header>
    )
}
