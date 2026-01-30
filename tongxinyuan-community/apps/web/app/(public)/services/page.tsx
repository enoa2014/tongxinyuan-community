
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Utensils, HeartHandshake, BookOpen, Sun, HelpCircle, Home, Smile, Users, Star, Gift } from "lucide-react";
import Image from "next/image";

import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper";
import { ServiceInquiryDialog } from "@/components/services/service-inquiry-dialog";
import { pb } from "@/lib/pocketbase";

// Map db icon strings to React components
const ICON_MAP: Record<string, any> = {
  utensils: Utensils,
  heart_handshake: HeartHandshake,
  book_open: BookOpen,
  sun: Sun,
  home: Home,
  smile: Smile,
  users: Users,
  star: Star,
  gift: Gift
};

const COLOR_MAP: Record<string, string> = {
  green: "bg-green-50 border-green-200",
  yellow: "bg-yellow-50 border-yellow-200",
  blue: "bg-blue-50 border-blue-200",
  orange: "bg-orange-50 border-orange-200",
  red: "bg-red-50 border-red-200",
  purple: "bg-purple-50 border-purple-200",
  teal: "bg-teal-50 border-teal-200",
  slate: "bg-slate-50 border-slate-200"
};

export const revalidate = 60; // ISR: Revalidate every 60 seconds

async function getServices() {
  try {
    const records = await pb.collection('services').getList(1, 100);
    // Sort logic: Order desc, then Created desc
    const sortedItems = records.items.sort((a, b) => {
      const orderDiff = (b.order || 0) - (a.order || 0);
      if (orderDiff !== 0) return orderDiff;
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });
    return sortedItems;
  } catch (e) {
    console.error("Failed to fetch services:", e);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

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
        {services.length > 0 ? (
          services.map((module) => {
            const IconComponent = ICON_MAP[module.icon] || HelpCircle;
            const colorClass = COLOR_MAP[module.color_theme] || "bg-slate-50 border-slate-200";

            return (
              <Card key={module.id} className={`border-2 ${colorClass} transition-all hover:shadow-md`}>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <IconComponent className={`h-8 w-8 ${module.color_theme === 'green' ? 'text-brand-green' :
                      module.color_theme === 'yellow' ? 'text-brand-yellow' :
                        `text-${module.color_theme}-500`
                      }`} />
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
            );
          })
        ) : (
          // Fallback if DB is empty or fails
          <div className="col-span-2 text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed">
            <p>暂无服务数据，请检查后台连接</p>
          </div>
        )}
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
