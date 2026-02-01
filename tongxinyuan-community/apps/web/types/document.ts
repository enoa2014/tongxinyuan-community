export interface BeneficiaryDocument {
    id: string
    collectionId: string
    collectionName: string
    created: string
    updated: string
    beneficiary: string
    title: string
    file: string
    category: "Medical Report" | "ID Document" | "Application Form" | "Agreement" | "Other"
    uploaded_by?: string
}
