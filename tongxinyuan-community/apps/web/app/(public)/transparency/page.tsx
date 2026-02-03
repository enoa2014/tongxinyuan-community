import { StatsDashboard } from "@/components/public/transparency/stats-dashboard"
import { DonationWall } from "@/components/public/transparency/donation-wall"
import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart } from "lucide-react"

export const revalidate = 0 // Dynamic page

export default async function TransparencyPage() {
    return (
        <InnerPageWrapper
            title="公益透明"
            subtitle="每一笔善款的流向，都是我们对信任的坚守。在此公示所有捐赠收支，接受社会监督。"
            imageUrl="/images/banner-donate.png"
            heroAction={
                <Button size="lg" className="rounded-full font-bold bg-brand-green hover:bg-brand-green/90 text-white shadow-lg shadow-brand-green/20" asChild>
                    <Link href="/donate">
                        <Heart className="mr-2 h-5 w-5 fill-current" />
                        我要捐赠
                    </Link>
                </Button>
            }
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
