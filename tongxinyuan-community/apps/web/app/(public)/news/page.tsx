
import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper";
import { NewsCard } from "@/components/news/news-card";
import { NEWS_ITEMS } from "@/lib/data/news";

export default function NewsPage() {
    return (
        <InnerPageWrapper
            title="新闻资讯"
            subtitle="了解同心源的最新动态、媒体报道与行业政策"
            imageUrl="/images/banner-news.png"
        >
            <div className="container mx-auto px-4 py-12">
                {/* Category Tabs could be added here in phase 2 */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {NEWS_ITEMS.map((news) => (
                        <NewsCard key={news.id} news={news} />
                    ))}
                </div>
            </div>
        </InnerPageWrapper>
    );
}
