import { ArrowRight, Gift, HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SupportCTA() {
    return (
        <section className="py-24 bg-gradient-to-br from-teal-900 to-slate-900 text-white overflow-hidden relative">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-sm font-medium text-teal-300">
                            <HandHeart className="mr-2 h-3.5 w-3.5" />
                            <span>加入我们要</span>
                        </div>
                        <h2 className="text-4xl font-heading font-bold tracking-tight sm:text-5xl">
                            您的每一次支持 <br />
                            都将点亮一个家庭的希望
                        </h2>
                        <p className="text-lg text-teal-100/80 max-w-xl">
                            同心源长期需要米面油等生活物资，以及绘本、玩具等儿童用品。
                            您也可以注册成为志愿者，用闲暇时间陪伴孩子玩耍，或提供技能支持。
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button asChild size="lg" className="h-14 bg-white text-teal-900 hover:bg-teal-50 rounded-full font-bold shadow-lg">
                                <Link href="/donate">
                                    <Gift className="mr-2 h-5 w-5" />
                                    我要捐赠
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-14 border-teal-400 text-teal-300 hover:bg-teal-900/50 hover:text-white rounded-full">
                                <Link href="/get-involved">
                                    <ArrowRight className="mr-2 h-5 w-5" />
                                    注册志愿者
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full mr-3"></span>
                            当前急需物资 (Live Needs)
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: "大米 (5kg)", count: "需要 20 袋", urgency: "高" },
                                { name: "儿童绘本 (3-6岁)", count: "不限", urgency: "中" },
                                { name: "水彩笔/画纸", count: "30 套", urgency: "高" },
                                { name: "食用油 (1.8L)", count: "10 桶", urgency: "中" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-teal-200">{item.count}</span>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${item.urgency === '高' ? 'bg-red-500/20 text-red-200' : 'bg-yellow-500/20 text-yellow-200'
                                            }`}>
                                            {item.urgency}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-xs text-slate-400">
                                请联系客服确认邮寄地址，感谢您的爱心
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
