import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, FileText, Heart, ShieldCheck, Users } from "lucide-react";

import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper";

export default function AboutPage() {
    return (
        <InnerPageWrapper
            title="关于同心源"
            subtitle="为异地求医的大病患儿家庭，打造一个“家以外的家”。"
            imageUrl="/images/banner-about.png"
        >

            {/* Story Structure */}
            <div className="space-y-24">

                {/* 1. Our Story */}
                <section>
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800">
                                <CalendarDays className="mr-2 h-4 w-4" />
                                <span>发展历程</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">从“小家”到“社区”的蜕变</h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                                <p>
                                    同心源的故事始于 2020 年。那时，许多异地来大城市求医的白血病患儿家庭面临着巨大的经济压力和生活困难。我们在医院附近租下了第一间房子，为他们提供免费的临时住所和共享厨房。
                                </p>
                                <p>
                                    2024-2025 年，随着行业环境的变化，我们经历了深刻的转型阵痛。但我们没有放弃，而是选择从单纯的“住宿点”向“社区支持中心”升级。
                                </p>
                                <p>
                                    如今的同心源，不仅提供物理空间的庇护，更致力于构建一个包含心理疏导、儿童康乐、生命教育的完整支持网络。我们坚信，通过连接志愿者、捐赠人和社会各界的力量，每一份爱心都能汇聚成守护生命的强大力量。
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            {/* History Illustration */}
                            <Image
                                src="/about-history.png"
                                alt="同心源发展历程"
                                width={800}
                                height={600}
                                className="rounded-2xl shadow-xl border border-slate-100"
                            />
                        </div>
                    </div>
                </section>

                {/* 2. Transparency Report */}
                <section className="bg-slate-50 p-8 md:p-12 rounded-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">透明度报告</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            信任是我们生存的基石。作为一家依托社会支持的公益机构，我们承诺每一笔资金的流向公开、透明。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="bg-white border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-teal-600" />
                                    财务披露
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-slate-500">定期发布月度/年度财务报告，接受社会监督。</p>
                                <ul className="space-y-2">
                                    <li className="flex justify-between items-center text-sm border-b pb-2">
                                        <span>2025年度财务审计报告</span>
                                        <a href="#" className="text-teal-600 hover:underline">下载 PDF</a>
                                    </li>
                                    <li className="flex justify-between items-center text-sm border-b pb-2">
                                        <span>2025年12月月度报表</span>
                                        <a href="#" className="text-teal-600 hover:underline">查看详情</a>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-teal-600" />
                                    合规资质
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-700">民非注册</Badge>
                                        <span>统一社会信用代码: 52450000XXXXXXXXXX</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-700">慈善组织</Badge>
                                        <span>具备公开募捐资格 (合作公募)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-teal-600" />
                                    善款流向
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <div className="flex justify-between">
                                        <span>患儿家庭直接资助</span>
                                        <span className="font-bold">65%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                    </div>

                                    <div className="flex justify-between mt-2">
                                        <span>项目执行成本 (小家运营)</span>
                                        <span className="font-bold">25%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                                    </div>

                                    <div className="flex justify-between mt-2">
                                        <span>行政与筹款成本</span>
                                        <span className="font-bold">10%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* 3. Team */}
                <section>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-4">
                            <Users className="mr-2 h-4 w-4" />
                            <span>我们的团队</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">专业温暖的守护者</h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {/* Team Member 1 */}
                        <div className="text-center group">
                            <div className="relative mx-auto w-32 h-32 rounded-full bg-slate-200 overflow-hidden mb-4 border-4 border-white shadow-lg transition-transform group-hover:scale-105">
                                {/* Avatar Placeholder */}
                                <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 text-xs">Photo</div>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">王小源</h3>
                            <p className="text-teal-600 text-sm mb-2">发起人 / 总干事</p>
                            <p className="text-slate-500 text-xs px-4">曾获全国优秀志愿者，拥有10年公益项目管理经验。</p>
                        </div>

                        {/* Team Member 2 */}
                        <div className="text-center group">
                            <div className="relative mx-auto w-32 h-32 rounded-full bg-slate-200 overflow-hidden mb-4 border-4 border-white shadow-lg transition-transform group-hover:scale-105">
                                <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 text-xs">Photo</div>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">李医生</h3>
                            <p className="text-teal-600 text-sm mb-2">医疗顾问</p>
                            <p className="text-slate-500 text-xs px-4">三甲医院血液科副主任医师，为患儿家庭提供专业医疗咨询。</p>
                        </div>

                        {/* Team Member 3 */}
                        <div className="text-center group">
                            <div className="relative mx-auto w-32 h-32 rounded-full bg-slate-200 overflow-hidden mb-4 border-4 border-white shadow-lg transition-transform group-hover:scale-105">
                                <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 text-xs">Photo</div>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">陈社工</h3>
                            <p className="text-teal-600 text-sm mb-2">高级社工师</p>
                            <p className="text-slate-500 text-xs px-4">专注于大病儿童心理支持与家庭个案管理。</p>
                        </div>

                        {/* Team Member 4 */}
                        <div className="text-center group">
                            <div className="relative mx-auto w-32 h-32 rounded-full bg-slate-200 overflow-hidden mb-4 border-4 border-white shadow-lg transition-transform group-hover:scale-105">
                                <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 text-xs">Photo</div>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">志愿者伙伴</h3>
                            <p className="text-teal-600 text-sm mb-2">3000+ 爱心力量</p>
                            <p className="text-slate-500 text-xs px-4">来自各行各业的志愿者，如星火般汇聚，温暖每一个角落。</p>
                        </div>
                    </div>
                </section>

            </div>
        </InnerPageWrapper>
    );
}
