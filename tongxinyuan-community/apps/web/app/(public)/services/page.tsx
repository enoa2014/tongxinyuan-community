
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Utensils, HeartHandshake, BookOpen, Sun } from "lucide-react";
import Image from "next/image";

import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper";
import { ServiceInquiryDialog } from "@/components/services/service-inquiry-dialog";

export default function ServicesPage() {
  const modules = [
    {
      title: "生活支持 (Life Support)",
      icon: <Utensils className="h-8 w-8 text-brand-green" />,
      description: "不仅是住宿，更是生活。我们提供爱心物资站和共享厨房，让患儿家庭能吃上热腾腾的家乡菜，降低生活成本，并在烟火气中重建社交链接。",
      color: "bg-green-50 border-green-200"
    },
    {
      title: "喘息服务 (Respite Services)",
      icon: <HeartHandshake className="h-8 w-8 text-brand-yellow" />,
      description: "为长期照护的家长提供心理疏导与互助网络。通过社工专业陪伴和艺术疗愈，让疲惫的心灵得到片刻的休息与充电。",
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      title: "儿童康乐 (Child Recreation)",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      description: "防止长期就医导致的心理发展脱轨。我们提供绘本阅读和游戏治疗，守护孩子童年的快乐与色彩。",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "生命教育 (Life Education)",
      icon: <Sun className="h-8 w-8 text-orange-500" />,
      description: "社区化安宁疗护。与临床医疗互补，提升家庭面对生死议题的韧性，让每一个生命都得到尊严与温暖。",
      color: "bg-orange-50 border-orange-200"
    }
  ];

  return (
    <InnerPageWrapper
      title="社区支持中心"
      subtitle="不仅仅是住宿，更是“异乡的家”。从单一住宿点升级为复合功能的社区中心，全方位守护大病患儿家庭。"
      imageUrl="/images/banner-services.png"
    >

      {/* Vision Transition */}
      <div className="mb-16 bg-white rounded-2xl p-8 shadow-sm border text-center">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="space-y-2 opacity-60">
            <h3 className="text-xl font-semibold">旧模式</h3>
            <p>单一住宿点 / 平台依赖</p>
          </div>
          <div className="text-3xl text-brand-green font-bold">→ 愿景升级 →</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-brand-green">新模式</h3>
            <p className="font-medium">自主生长的“社区共同体”</p>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {modules.map((module, index) => (
          <Card key={index} className={`border-2 ${module.color} transition-all hover:shadow-md`}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-white rounded-full shadow-sm">
                {module.icon}
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed mb-4">
                {module.description}
              </p>
              <ServiceInquiryDialog serviceTitle={module.title} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Operational Mechanism */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">专业运营与管理</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-slate-50 rounded-xl">
            <div className="font-bold text-lg mb-2">精准需求评估</div>
            <p className="text-sm text-slate-500">严格核实病情证明与经济状况，确保资源流向最紧迫群体。</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl">
            <div className="font-bold text-lg mb-2">建档立卡管理</div>
            <p className="text-sm text-slate-500">全流程跟踪服务记录，实现精细化个案管理。</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl">
            <div className="font-bold text-lg mb-2">物资闭环发放</div>
            <p className="text-sm text-slate-500">定期举办“爱心市集”，按需领取，维护受助者尊严。</p>
          </div>
        </div>
      </div>
    </InnerPageWrapper>
  );
}
