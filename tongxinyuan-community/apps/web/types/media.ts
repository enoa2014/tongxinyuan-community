export interface BeneficiaryMedia {
    id: string
    file: string
    caption?: string
    category: "Life" | "Medical" | "Document" | "Other"
    is_public: boolean
    captured_date?: string
    beneficiary: string
    created: string
    updated: string
}
