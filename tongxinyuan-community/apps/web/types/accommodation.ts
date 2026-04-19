export interface AccommodationRecord {
    id: string
    collectionId: string
    collectionName: string
    created: string
    updated: string
    beneficiary: string
    unit?: string
    room_number: string
    start_date: string
    end_date?: string
    record_type: "Check-in" | "Extension" | "Check-out" | "Transfer"
    fee_amount?: number
    payment_status?: "pending" | "paid" | "waived"
    waiver_reason?: string
    notes?: string
    expand?: {
        beneficiary?: {
            id: string
            name?: string
        }
        unit?: {
            id: string
            name: string
        }
    }
}
