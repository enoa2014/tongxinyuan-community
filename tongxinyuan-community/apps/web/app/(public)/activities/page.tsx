import { ActivityList } from "@/components/public/activities/activity-list"
import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper"

export default function ActivitiesPage() {
    return (
        <InnerPageWrapper
            title="公益活动"
            subtitle="加入我们，用行动传递温暖。在这里，您可以查看正在招募的志愿活动，或回顾往期精彩瞬间。"
            imageUrl="/images/banner-volunteer.png"
        >
            <ActivityList />
        </InnerPageWrapper>
    )
}
