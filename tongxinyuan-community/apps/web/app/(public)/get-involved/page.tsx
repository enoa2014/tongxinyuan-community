import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users2, Star, ShieldCheck, Gem } from "lucide-react";
import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper";
import { VolunteerForm } from "@/components/volunteer/volunteer-form";

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
        <InnerPageWrapper
            title="成为同心源的一员"
            subtitle="无论是贡献时间还是爱心，您的每一次参与，都在为异地求医的大病患儿家庭点亮一盏灯。"
            imageUrl="/images/banner-volunteer.png"
        >

            {/* Hero Visualization */}
            <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <Image
                    src="/volunteer-hero.png"
                    alt="同心源志愿者服务"
                    width={1200}
                    height={400}
                    className="w-full object-cover"
                />
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Volunteer Section */}
                <section className="bg-white p-8 md:p-12 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-brand-yellow/20 rounded-full">
                            <Users2 className="h-8 w-8 text-brand-yellow" />
                        </div>
                        <h2 className="text-3xl font-bold">加入志愿者</h2>
                    </div>

                    <div className="space-y-8">
                        <p className="text-slate-600 text-lg leading-relaxed">
                            我们需要多元化的力量。同心源建立了分级志愿者培养体系，无论您是学生、职场人士还是专业专家，都能找到适合的位置。
                        </p>

                        <div className="space-y-4">
                            {volunteerLevels.map((level, index) => (
                                <Card key={index} className={`border-l-4 ${level.color} transition-all hover:shadow-md hover:-translate-y-1`}>
                                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                                        <div className="p-3 bg-slate-50 rounded-full w-fit">{level.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                                                {level.level} <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">({level.role})</span>
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-semibold text-slate-700">职责:</span> {level.duties}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-slate-700">要求:</span> {level.requirements}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-slate-100">
                            <h3 className="text-xl font-bold mb-6 text-center">立即填写报名表</h3>
                            <VolunteerForm />
                        </div>
                    </div>
                </section>
            </div>
        </InnerPageWrapper>
    );
}
