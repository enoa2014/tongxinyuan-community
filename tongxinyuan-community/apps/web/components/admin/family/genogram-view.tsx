
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
                let style = ""
                if (member.health_status && (member.health_status.includes("去世") || member.health_status.includes("Deceased"))) {
                    style = `style ${memberId} fill:#9CA3AF,stroke:#333,stroke-dasharray: 5 5`
                } else if (member.health_status && (member.health_status.includes("病") || member.health_status.includes("Ill"))) {
                    style = `style ${memberId} fill:#FCA5A5,stroke:#EF4444`
                }

                graphDefinition += `    ${memberId}("${safeLabel(member.name)}\n<small>${member.age ? member.age + '岁' : ''}</small>")\n`
                if (style) graphDefinition += `    ${style}\n`

                // Link direction: Older generations usually above, peers same level? 
                // Mermaid TD: 
                // Parents -> Beneficiary
                // Beneficiary -> Children (if any)
                // Siblings?

                // Simplified: Links with labels
                if (["Father", "Mother", "Grandparent"].includes(member.relation)) {
                    graphDefinition += `    ${memberId} -->|${relationLabel}| ${centerId}\n`
                } else if (["Son", "Daughter"].includes(member.relation)) {
                    graphDefinition += `    ${centerId} -->|${relationLabel}| ${memberId}\n`
                } else {
                    // Siblings / Others: Double link or side by side? 
                    // Let's just point to Beneficiary for now context
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
                <div className="flex gap-4 text-xs mt-4 justify-center text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-600 rounded-sm"></span> 受助人</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-300 rounded-sm"></span> 患病</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-400 rounded-sm border-dashed border border-gray-600"></span> 已故</span>
                </div>
            </CardContent>
        </Card>
    )
}
