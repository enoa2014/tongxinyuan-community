import { ActivityList } from "@/components/public/activities/activity-list"
import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users2 } from "lucide-react"

export default function ActivitiesPage() {
    return (
        <InnerPageWrapper
            title="公益活动"
            subtitle="汇聚点滴爱心，传递温暖希望。加入我们，参与各类公益活动，为孩子们带去欢笑。"
            imageUrl="/images/banner-volunteer.png"
            heroAction={
                <Button size="lg" className="rounded-full font-bold bg-white text-brand-green hover:bg-slate-100 shadow-lg" asChild>
                    <Link href="/get-involved">
                        <Users2 className="mr-2 h-5 w-5" />
                        注册成为志愿者
                    </Link>
                </Button>
            }
        >
            <ActivityList />
        </InnerPageWrapper>
    )
}

