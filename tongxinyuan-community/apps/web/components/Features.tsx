import Link from "next/link";

export default function Features() {
    const features = [
        {
            icon: "🏠",
            title: "温暖住宿",
            description: "为异地就医的大病儿童家庭提供免费或低成本的爱心住宿，解决在大城市看病“住不起”的难题，让您拥有一个临时的家。",
            link: "/accommodation",
            color: "bg-orange-50 text-orange-600",
            btnColor: "text-orange-600 hover:bg-orange-50"
        },
        {
            icon: "🥗",
            title: "共享厨房",
            description: "设备齐全的免费厨房，柴米油盐一应俱全。让孩子在异乡也能吃到妈妈做的手擀面，用熟悉的味道抚慰病痛。",
            link: "/kitchen",
            color: "bg-cyan-50 text-cyan-600",
            btnColor: "text-cyan-600 hover:bg-cyan-50"
        },
        {
            icon: "⚖️",
            title: "政策助手",
            description: "专业的社工与AI助手结合，为您解读复杂的异地医保报销、大病救助政策，协助准备申请材料，不再走弯路。",
            link: "/policy",
            color: "bg-blue-50 text-blue-600",
            btnColor: "text-blue-600 hover:bg-blue-50"
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-display text-3xl font-bold text-text mb-4">
                        全方位的社区支持
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        从生活起居到政策咨询，我们致力于为您解决异地求医路上的每一个实际困难。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group border border-slate-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                            <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>

                            <h3 className="font-display text-xl font-bold text-text mb-4">
                                {feature.title}
                            </h3>

                            <p className="text-slate-600 mb-8 leading-relaxed">
                                {feature.description}
                            </p>

                            <Link href={feature.link} className={`inline-flex items-center font-bold ${feature.btnColor} transition-colors group-hover:underline`}>
                                了解详情
                                <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
