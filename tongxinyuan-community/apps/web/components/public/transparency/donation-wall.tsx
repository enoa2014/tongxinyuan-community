"use client"

import { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { Donation } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Loader2 } from "lucide-react"

export function DonationWall() {
    const [donations, setDonations] = useState<Donation[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const fetchDonations = async (pageNumber: number) => {
        setIsLoading(true)
        try {
            const result = await pb.collection("public_donations").getList<Donation>(pageNumber, 12, {
                filter: 'status = "published"',
                sort: '-donate_date',
                requestKey: null
            })

            if (pageNumber === 1) {
                setDonations(result.items)
            } else {
                setDonations(prev => [...prev, ...result.items])
            }

            setHasMore(result.items.length === 12)
        } catch (error) {
            console.error("Failed to fetch donations:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDonations(1)
    }, [])

    const loadMore = () => {
        const nextPage = page + 1
        setPage(nextPage)
        fetchDonations(nextPage)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">爱心榜单</h2>
            </div>

            {/* Masonry-like grid using CSS columns */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {donations.map((donation) => (
                    <div key={donation.id} className="break-inside-avoid">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="font-semibold text-lg">{donation.donor_name || "爱心人士"}</div>
                                    <Badge variant="secondary" className="whitespace-nowrap">
                                        {donation.project_name}
                                    </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {format(new Date(donation.donate_date), "yyyy年MM月dd日", { locale: zhCN })}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-brand-green font-medium text-lg mb-2">
                                    捐赠：{donation.amount}
                                </div>
                                {donation.description && (
                                    <p className="text-sm text-muted-foreground italic">
                                        “{donation.description}”
                                    </p>
                                )}
                                {donation.images && donation.images.length > 0 && (
                                    <div className="mt-4 rounded-md overflow-hidden h-40 relative">
                                        <img
                                            src={pb.files.getURL(donation, donation.images[0])}
                                            alt="捐赠现场"
                                            className="object-cover w-full h-full"
                                        />
                                        {donation.images.length > 1 && (
                                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                                +{donation.images.length - 1} 张
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-8">
                    <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        加载更多
                    </button>
                </div>
            )}
        </div>
    )
}
