import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative bg-background overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
                <div className="absolute top-20 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-secondary/30 text-primary text-sm font-medium mb-6 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-cta animate-pulse"></span>
                        2026年全新升级 · 更好的社区支持
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
                        为异地求医家庭<br />
                        在<span className="text-primary">大城市</span>安一个<span className="text-cta">家</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                        我们提供<span className="font-bold text-text">免费住宿</span>、<span className="font-bold text-text">共享厨房</span>和专业的<span className="font-bold text-text">政策辅导</span>支持。
                        <br className="hidden sm:block" />
                        让每一份爱心都能温暖前行的路，让求医不再孤单。
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-primary hover:bg-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                            申请入住支持
                        </button>
                        <button className="bg-white text-primary border-2 border-primary/20 hover:border-primary hover:bg-primary/5 px-8 py-4 rounded-xl font-bold text-lg transition-all">
                            了解我们的故事
                        </button>
                    </div>

                    {/* Stats / Trust Indicators */}
                    <div className="mt-16 pt-8 border-t border-slate-200 flex flex-wrap justify-center gap-8 sm:gap-16 text-slate-500">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-text">5,000+</div>
                            <div className="text-sm mt-1">服务家庭</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-text">120,000</div>
                            <div className="text-sm mt-1">爱心餐份数</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-text">100%</div>
                            <div className="text-sm mt-1">公益透明度</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
