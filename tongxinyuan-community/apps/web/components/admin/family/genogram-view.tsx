
"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import { FamilyMember } from "@/types/family-member"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GenogramViewProps {
    beneficiaryName: string
    familyMembers: FamilyMember[]
}

export function GenogramView({ beneficiaryName, familyMembers }: GenogramViewProps) {
    const chartRef = useRef<HTMLDivElement>(null)
    const [svgContent, setSvgContent] = useState<string>("")

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'inherit'
        })
    }, [])

    useEffect(() => {
        const renderChart = async () => {
            if (!chartRef.current) return

            // Construct Mermaid Syntax
            // Center: Beneficiary
            // Nodes: Family Members linked to Center

            // Sanitize names for IDs (remove non-alphanumeric)
            const safeId = (id: string) => `node_${id.replace(/[^a-zA-Z0-9]/g, "_")}`
            const safeLabel = (text: string) => text.replace(/["()]/g, "")

            const centerId = "Beneficiary"
            let graphDefinition = `graph TD\n`
            graphDefinition += `    ${centerId}("${safeLabel(beneficiaryName)}")\n`
            graphDefinition += `    style ${centerId} fill:#16A34A,color:#fff,stroke:#333,stroke-width:2px\n`

            familyMembers.forEach((member) => {
                const memberId = safeId(member.id)
                const relationLabel = member.relation || "Kin"
                // Color coding based on health status (simple heuristic)
                // Compute Badges & Labels
                const badges: string[] = []
                if (member.is_caregiver) badges.push("❤️") // Caregiver
                if (member.income_contribution) badges.push("💰") // Earner
                if (member.is_guardian) badges.push("🛡️") // Guardian
                if (member.health_status && (member.health_status.includes("病") || member.health_status.includes("Ill"))) badges.push("💊") // Ill

                const extraLabel = badges.length > 0 ? `<br/>${badges.join(" ")}` : ""

                // Color coding based on health status (Prioritized)
                let style = ""
                // 1. Deceased (Highest Priority for Visuals - Grey)
                if (member.health_status && (member.health_status.includes("去世") || member.health_status.includes("Deceased"))) {
                    style = `style ${memberId} fill:#9CA3AF,stroke:#333,stroke-dasharray: 5 5`
                }
                // 2. Ill (Red) - Only if NOT beneficiary (Beneficiary is Green)
                else if (member.health_status && (member.health_status.includes("病") || member.health_status.includes("Ill"))) {
                    style = `style ${memberId} fill:#FCA5A5,stroke:#EF4444`
                }
                // 3. Dual Role (Caregiver + Earner) -> Purple
                else if (member.is_caregiver && member.income_contribution) {
                    style = `style ${memberId} fill:#E9D5FF,stroke:#9333EA,stroke-width:2px`
                }
                // 4. Caregiver -> Blue
                else if (member.is_caregiver) {
                    style = `style ${memberId} fill:#BFDBFE,stroke:#2563EB,stroke-width:2px`
                }
                // 5. Earner -> Yellow
                else if (member.income_contribution) {
                    style = `style ${memberId} fill:#FEF3C7,stroke:#D97706,stroke-width:2px`
                }

                graphDefinition += `    ${memberId}("${safeLabel(member.name)}\n<small>${member.age ? member.age + '岁' : ''}</small>${extraLabel}")\n`
                if (style) graphDefinition += `    ${style}\n`

                // Link direction: Older generations usually above, peers same level? 
                // Mermaid TD: 
                // Parents -> Beneficiary
                // Beneficiary -> Children (if any)
                // Siblings?

                // Mapping Logic for Chinese Relations
                if (["父亲", "母亲", "祖父", "祖母", "外祖父", "外祖母", "Father", "Mother"].includes(member.relation)) {
                    graphDefinition += `    ${memberId} -->|${relationLabel}| ${centerId}\n`
                } else if (["儿子", "女儿", "Son", "Daughter"].includes(member.relation)) {
                    graphDefinition += `    ${centerId} -->|${relationLabel}| ${memberId}\n`
                } else {
                    graphDefinition += `    ${memberId} ---|${relationLabel}| ${centerId}\n`
                }
            })

            try {
                const { svg } = await mermaid.render('genogram-svg-' + Date.now(), graphDefinition)
                setSvgContent(svg)
            } catch (error) {
                console.error("Mermaid failed to render", error)
                setSvgContent(`<div class="text-red-500">Failed to render graph</div>`)
            }
        }

        renderChart()
    }, [beneficiaryName, familyMembers])

    return (
        <Card>
            <CardHeader>
                <CardTitle>家庭关系图谱 Genogram</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    ref={chartRef}
                    className="flex justify-center overflow-x-auto min-h-[300px]"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                />
                <div className="flex flex-wrap gap-4 text-xs mt-4 justify-center text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-600 rounded-sm"></span> 受助人</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-200 border-blue-600 border rounded-sm"></span> 照顾者 Caregiver ❤️</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-100 border-yellow-600 border rounded-sm"></span> 经济支柱 Earner 💰</span>
                    <span className="flex items-center gap-1 text-base">🛡️ 法定监护人 Guardian</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-200 border-purple-600 border rounded-sm"></span> 双重角色 Both</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-300 rounded-sm"></span> 患病 Ill 💊</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-400 rounded-sm border-dashed border border-gray-600"></span> 已故 Deceased</span>
                </div>
            </CardContent>
        </Card>
    )
}
