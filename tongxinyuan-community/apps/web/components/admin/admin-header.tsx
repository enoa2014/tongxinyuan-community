
"use client"

import { pb } from "@/lib/pocketbase"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AdminHeader() {
    const [userEmail, setUserEmail] = useState("")

    useEffect(() => {
        if (pb.authStore.isValid && pb.authStore.model) {
            setUserEmail(pb.authStore.model.email || "Admin")
        }
    }, [])

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
            <div className="flex items-center">
                {/* Breadcrumbs placeholder or Page Title could go here */}
                <h1 className="text-lg font-semibold text-slate-800">控制台</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">管理员</p>
                    <p className="text-xs text-slate-500">{userEmail}</p>
                </div>
                <Avatar>
                    <AvatarFallback className="bg-brand-green text-white">AD</AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}
