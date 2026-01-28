
import { InnerPageWrapper } from "@/components/layout/inner-page-wrapper";
import { BankCard } from "@/components/donation/bank-card";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Heart, Truck } from "lucide-react";

export default function DonatePage() {
    return (
        <InnerPageWrapper
            title="支持我们"
            subtitle="您的每一份爱心，都将化作患儿家庭在异乡的温暖港湾"
            imageUrl="/images/banner-donate.png"
        >
            <div className="container mx-auto px-4 py-16">

                {/* Compliance Alert */}
                <div className="max-w-4xl mx-auto mb-16">
                    <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
                        <ShieldAlert className="h-5 w-5 text-red-600" />
                        <AlertTitle className="font-bold mb-1 ml-2">重要合规提示</AlertTitle>
                        <AlertDescription className="ml-2 text-red-800/80">
                            同心源不接受任何私人转账。所有资金必须进入机构对公账户，接受审计监督，并为您开具正式的公益事业捐赠票据。若发现任何冒用“同心源”名义的个人收款行为，请立即举报。
                        </AlertDescription>
                    </Alert>
                </div>

                <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto items-start">

                    {/* Left: Money Donation */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
                                <Heart className="h-6 w-6 text-brand-green" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">资金捐赠</h2>
                        </div>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            您的捐款将用于支持小家的房屋租金、水电费、特困家庭的生活补助以及患儿的营养餐计划。
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <BankCard
                                bankName="中国工商银行南宁市北大支行"
                                accountName="南宁市同心源社会工作服务中心"
                                accountNumber="2102 1102 0930 0056 618"
                            />
                        </div>
                    </div>

                    {/* Right: Goods Donation */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center">
                                <Truck className="h-6 w-6 text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">物资捐赠</h2>
                        </div>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            小家长期需要生活必需品。您可以直接在电商平台下单寄送给我们，或将家中的闲置物品（八成新以上）寄给我们。
                        </p>

                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 space-y-4">
                            <h3 className="font-semibold text-slate-800">急需物资清单:</h3>
                            <ul className="list-disc list-inside text-slate-600 space-y-1 ml-2">
                                <li>大米、食用油、面条</li>
                                <li>洗衣服、洗洁精、卷纸</li>
                                <li>儿童绘本、画笔、玩具 (非毛绒类)</li>
                                <li>电饭煲、电磁炉等小家电</li>
                            </ul>

                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <h3 className="font-semibold text-slate-800 mb-2">收件地址:</h3>
                                <p className="text-slate-600 text-sm font-mono bg-white p-3 rounded border">
                                    南宁市西乡塘区万秀村二队九栋<br />
                                    同心源社工 (收) <br />
                                    电话: 0771-6758590
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQs Section */}
                <div className="max-w-3xl mx-auto mt-24">
                    <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">捐赠常见问题</h2>
                    <FaqAccordion category="donor" />
                </div>

            </div>
        </InnerPageWrapper>
    );
}
