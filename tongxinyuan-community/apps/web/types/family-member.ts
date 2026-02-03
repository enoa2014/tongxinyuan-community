
export interface FamilyMember {
    id: string
    name: string
    relation: string // "父亲" | "母亲" | "兄弟" | "姐妹" | "祖辈" | "监护人" | "姑姑" | ...
    age?: number
    health_status?: string
    occupation?: string
    income_contribution?: boolean
    is_caregiver?: boolean
    is_guardian?: boolean // Legal Guardian
    notes?: string
    phone?: string
    beneficiary: string
    created: string
    updated: string
}

export type FamilyRelationType = FamilyMember["relation"]
