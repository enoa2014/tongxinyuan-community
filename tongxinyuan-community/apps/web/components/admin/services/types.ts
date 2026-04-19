import type { LucideIcon } from "lucide-react"

import type { ServicesResponse } from "@/types/pocketbase-types"

export type ServiceItem = ServicesResponse & {
    created?: string
    updated?: string
}

export type ServiceIconMap = Record<string, LucideIcon>

export type ServiceConsultationHistoryEntry = {
    action: string
    date: string
    operator?: string
    prevStatus?: string
}
