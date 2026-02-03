import { StatsDashboard } from "@/components/public/transparency/stats-dashboard"
import { DonationWall } from "@/components/public/transparency/donation-wall"
import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper"

export default function TransparencyPage() {
    return (
        <InnerPageWrapper
            title="公益透明"
            subtitle="我们承诺公开每一笔捐赠款项的去向，接受社会各界监督。您的每一份爱心，都将真实地传达到需要帮助的家庭手中。"
            imageUrl="/images/banner-donate.png"
        >
            <div className="space-y-12">
                <StatsDashboard />

                <div className="border-t pt-10">
                    <DonationWall />
                </div>
            </div>
        </InnerPageWrapper>
    )
}
