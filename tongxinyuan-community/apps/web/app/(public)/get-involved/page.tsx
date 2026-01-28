
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users2, Star, ShieldCheck, Gem } from "lucide-react";

export default function GetInvolvedPage() {
    const volunteerLevels = [
        {
            level: "Level 1: 普适型",
            role: "基础支持",
            icon: <Users2 className="h-6 w-6 text-slate-600" />,
            requirements: "无需专业背景，热爱公益",
            duties: "后勤支持、物资搬运、环境保洁、接待引导",
            color: "bg-slate-50 border-slate-200"
        },
        {
            level: "Level 2: 康乐型",
            role: "陪伴服务",
            icon: <Star className="h-6 w-6 text-brand-yellow" />,
            requirements: "需接受心理/防感培训",
            duties: "病房陪伴、绘本阅读、游戏治疗辅助",
            color: "bg-yellow-50 border-yellow-200"
        },
        {
            level: "Level 3: 专业型",
            role: "核心服务",
            icon: <ShieldCheck className="h-6 w-6 text-brand-green" />,
            requirements: "具备医护、心理、法律等专业资质",
            duties: "生命教育、安宁舒缓、家庭心理疏导、法律援助",
            color: "bg-green-50 border-green-200"
        }
    ];

    return (
        <div className="container py-12 mx-auto">
            {/* Hero */}
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    成为同心源的一员
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    无论是贡献时间还是爱心，您的每一次参与，
                    <br />
                    都在为异地求医的大病患儿家庭点亮一盏灯。
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Volunteer Section */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-brand-yellow/20 rounded-full">
                            <Users2 className="h-8 w-8 text-brand-yellow" />
                        </div>
                        <h2 className="text-3xl font-bold">加入志愿者</h2>
                    </div>

                    <div className="space-y-6">
                        <p className="text-slate-600 mb-6">
                            我们需要多元化的力量。同心源建立了分级志愿者培养体系，无论您是学生、职场人士还是专业专家，都能找到适合的位置。
                        </p>

                        <div className="space-y-4">
                            {volunteerLevels.map((level, index) => (
                                <Card key={index} className={`border-l-4 ${level.color}`}>
                                    <CardContent className="p-4 flex items-start gap-4">
                                        <div className="mt-1">{level.icon}</div>
                                        <div>
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                {level.level} <span className="text-sm font-normal text-slate-500">({level.role})</span>
                                            </h3>
                                            <p className="text-sm font-medium mt-1">职责: {level.duties}</p>
                                            <p className="text-xs text-slate-500 mt-1">要求: {level.requirements}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-6">
                            <Button size="lg" className="w-full bg-brand-yellow text-slate-900 hover:bg-brand-yellow/90">
                                申请成为志愿者
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Donation Section */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-brand-green/20 rounded-full">
                            <Heart className="h-8 w-8 text-brand-green" />
                        </div>
                        <h2 className="text-3xl font-bold">支持我们</h2>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 h-fit">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <Gem className="h-5 w-5 text-brand-green" /> 成为月捐人
                            </h3>
                            <p className="text-slate-600 text-sm">
                                月捐是同心源实现“自主生长”的关键。持续稳定的支持，让我们能更从容地规划长期的患儿家庭服务。
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <Button variant="outline" className="h-20 text-lg hover:border-brand-green hover:text-brand-green">
                                ¥ 30 / 月
                                <span className="block text-xs font-normal text-slate-400 w-full">一顿午餐</span>
                            </Button>
                            <Button variant="outline" className="h-20 text-lg hover:border-brand-green hover:text-brand-green">
                                ¥ 100 / 月
                                <span className="block text-xs font-normal text-slate-400 w-full">一晚住宿</span>
                            </Button>
                            <Button variant="outline" className="h-20 text-lg hover:border-brand-green hover:text-brand-green">
                                ¥ 500 / 月
                                <span className="block text-xs font-normal text-slate-400 w-full">一次艺术疗愈</span>
                            </Button>
                            <Button variant="outline" className="h-20 text-lg hover:border-brand-green hover:text-brand-green">
                                自定义金额
                            </Button>
                        </div>

                        <Button size="lg" className="w-full bg-brand-green text-white hover:bg-brand-green/90">
                            立即捐赠
                        </Button>
                        <p className="text-xs text-center text-slate-400 mt-4">
                            您的每一笔捐赠都将进入同心源公募账户，并定期公开财务报告。
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
