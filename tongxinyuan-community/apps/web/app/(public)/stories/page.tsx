import { StoryList } from "@/components/public/stories/story-list"
import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper"

export default function StoriesPage() {
    return (
        <InnerPageWrapper
            title="社区故事"
            subtitle="记录同心源的点滴感动，分享志愿者与孩子们的真情时刻。每一篇故事，都是爱的见证。"
            imageUrl="/images/banner-news.png"
        >
            <StoryList />
        </InnerPageWrapper>
    )
}
