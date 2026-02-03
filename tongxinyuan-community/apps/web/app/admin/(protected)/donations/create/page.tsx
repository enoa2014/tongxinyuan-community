
import { DonationForm } from "@/components/admin/content/donation-form"
import { Separator } from "@/components/ui/separator"

export default function DonationCreatePage() {
    return (
        <div className="h-full flex flex-col space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">发布捐赠公示</h2>
                    <p className="text-muted-foreground">
                        创建并生成标准化的捐赠公示海报，用于网站展示和社交媒体传播。
                    </p>
                </div>
            </div>
            <Separator />
            <div className="flex-1">
                <DonationForm />
            </div>
        </div>
    )
}
