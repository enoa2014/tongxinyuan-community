import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header Skeleton */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-24" />
                </div>

                <div className="flex items-start gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <div className="flex gap-1">
                            <Skeleton className="h-5 w-12 rounded-full" />
                            <Skeleton className="h-5 w-12 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <Skeleton className="h-10 w-full rounded" />
                    <Skeleton className="h-10 w-full rounded" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="mt-2 flex-1 p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-24" />
                </div>

                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-lg p-4 border space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}
