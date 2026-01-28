"use client"

import Link from "next/link"
import { ArrowRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 pt-20">
            {/* Background Image/Gradient */}
            <div className="absolute inset-0 z-0">
                {/* Fallback gradient until we have a real image */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950" />

                {/* Mesh Gradient Overlay */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 15% 50%, #2DD4BF 0px, transparent 25%),
                            radial-gradient(circle at 85% 30%, #0D9488 0px, transparent 25%)
                        `,
                        filter: "blur(60px)",
                    }}
                />

                {/* Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="container mx-auto relative z-10 px-4 md:px-6 text-center">
                <div className="mx-auto max-w-3xl space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-sm font-medium text-teal-300 backdrop-blur-sm">
                        <Heart className="mr-2 h-3.5 w-3.5 fill-teal-300" />
                        <span className="tracking-wide">同心源 · 关爱异地大病求医儿童家庭</span>
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl drop-shadow-sm font-heading">
                        连接爱与希望 <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-cyan-400">
                            让求医之路不再孤单
                        </span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed">
                        我们为异地求医的大病儿童家庭提供免费住宿、共享厨房和心理支持。
                        在这里，我们不仅提供一个临时的住所，更是一个温暖的家。
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center pt-4">
                        <Button asChild size="lg" className="h-14 px-8 text-base bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/25 rounded-full transition-all hover:scale-105 active:scale-95">
                            <Link href="/login">
                                我需要帮助
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm rounded-full transition-all hover:scale-105 active:scale-95">
                            <Link href="/get-involved">
                                我想成为志愿者
                            </Link>
                        </Button>
                    </div>

                    <div className="pt-12 grid grid-cols-3 gap-4 text-center border-t border-white/10 mt-12">
                        <div>
                            <div className="text-2xl font-bold text-white">3,000+</div>
                            <div className="text-sm text-slate-400">服务家庭</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">50,000+</div>
                            <div className="text-sm text-slate-400">志愿时长</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">100%</div>
                            <div className="text-sm text-slate-400">公益免费</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
