
export interface FamilyMember {
    id: string
    name: string
    relation: "Father" | "Mother" | "Brother" | "Sister" | "Grandparent" | "Other"
    age?: number
    health_status?: string
    occupation?: string
    income_contribution?: boolean
    notes?: string
    beneficiary: string
    created: string
    updated: string
}

export type FamilyRelationType = FamilyMember["relation"]
