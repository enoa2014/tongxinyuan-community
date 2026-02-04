import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function InboxSkeleton() {
    return (
        <div className="space-y-4 p-4 pb-24">
            {[1, 2, 3].map(i => (
                <Card key={i} className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 mb-2">
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <div className="space-y-2 mt-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                        <div className="flex justify-end mt-4">
                            <Skeleton className="h-8 w-16 rounded" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
