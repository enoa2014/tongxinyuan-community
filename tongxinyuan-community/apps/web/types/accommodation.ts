export interface AccommodationRecord {
    id: string
    collectionId: string
    collectionName: string
    created: string
    updated: string
    beneficiary: string
    room_number: string
    start_date: string
    end_date?: string
    record_type: "Check-in" | "Extension" | "Check-out" | "Transfer"
    notes?: string
}
