import { Home, Utensils, HeartHandshake, BookOpen } from "lucide-react"
import Link from "next/link"

export function FeatureHighlights() {
    const features = [
        {
            title: "爱心住宿",
            description: "为异地求医家庭提供免费或低偿的临时住所，设施齐全，通过审核即可拎包入住，解决就医期间最大的经济负担。",
            icon: Home,
            image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop", // Placeholder: Warm home interior
            alt: "温馨的住宿环境",
            reverse: false
        },
        {
            title: "共享厨房",
            description: "提供全套厨具的爱心厨房，让孩子在异乡也能吃到家乡的味道。这里也是家长们交流抗癌经验、相互鼓励的社交中心。",
            icon: Utensils,
            image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop", // Placeholder: Kitchen cooking
            alt: "家长在做饭",
            reverse: true
        }
    ]

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-heading font-bold tracking-tight text-slate-900 sm:text-4xl">
                        我们提供的核心服务
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600">
                        从基本的衣食住行到心理支持，全方位关怀每一个大病患儿家庭
                    </p>
                </div>

                <div className="space-y-24">
                    {features.map((feature, index) => (
                        <div key={index} className={`flex flex-col lg:flex-row gap-12 items-center ${feature.reverse ? 'lg:flex-row-reverse' : ''}`}>
                            <div className="flex-1 w-full relative group">
                                <div className="absolute inset-0 bg-teal-200 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform opacity-30"></div>
                                <img
                                    src={feature.image === "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop" ? "/images/kitchen.jpg" : feature.image}
                                    alt={feature.alt}
                                    className="relative rounded-3xl shadow-xl w-full h-[400px] object-cover border-4 border-white z-10"
                                />
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center justify-center p-3 bg-teal-100/50 rounded-xl">
                                    <feature.icon className="h-8 w-8 text-teal-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900">{feature.title}</h3>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                                <ul className="space-y-3 pt-2">
                                    <li className="flex items-center text-slate-700">
                                        <div className="h-2 w-2 rounded-full bg-teal-500 mr-3" />
                                        <span>实名认证，安全保障</span>
                                    </li>
                                    <li className="flex items-center text-slate-700">
                                        <div className="h-2 w-2 rounded-full bg-teal-500 mr-3" />
                                        <span>社区氛围，互助支持</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
