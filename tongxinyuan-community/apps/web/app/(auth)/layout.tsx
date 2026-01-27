import React from "react";
import { Heart } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left Side: Branding & Hero with Artistic Background */}
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex border-r border-white/10 overflow-hidden font-sans">
                {/* Dynamic Mesh Gradient Background */}
                <div className="absolute inset-0 bg-teal-900" />
                <div
                    className="absolute inset-0 opacity-90"
                    style={{
                        backgroundImage: `
                            radial-gradient(at 0% 0%, #0891B2 0px, transparent 50%),
                            radial-gradient(at 100% 0%, #22D3EE 0px, transparent 50%),
                            radial-gradient(at 100% 100%, #115E59 0px, transparent 50%),
                            radial-gradient(at 0% 100%, #2DD4BF 0px, transparent 50%)
                        `,
                        filter: "blur(60px)"
                    }}
                />

                {/* Subtle Noise Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-150 contrast-150 mix-blend-overlay"></div>

                {/* Content Overlay */}
                <div className="relative z-20 flex items-center text-lg font-medium animate-fade-in">
                    <div className="bg-white/10 p-2.5 rounded-xl mr-3 backdrop-blur-md border border-white/20 shadow-lg group">
                        <Heart className="h-6 w-6 text-white fill-white/20 group-hover:fill-white/80 transition-all duration-500 animate-pulse-subtle" />
                    </div>
                    <span className="tracking-wide font-heading font-bold text-xl text-shadow-sm">同心源社区</span>
                </div>

                <div className="relative z-20 mt-auto animate-fade-in-up delay-300">
                    <blockquote className="space-y-6 max-w-lg">
                        <p className="text-3xl font-heading font-medium leading-tight text-white text-shadow-sm">
                            &ldquo;连接爱与希望，让异地求医的家庭不再孤单。&rdquo;
                        </p>
                        <footer className="text-sm font-medium text-teal-100/90 flex items-center gap-3">
                            <span className="w-12 h-0.5 bg-teal-200/50 rounded-full"></span>
                            同心源社会工作服务中心
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Side: Content Area */}
            <div className="lg:p-8 relative flex h-full items-center justify-center bg-medical-bg">
                {/* Mobile Background for small screens */}
                <div className="absolute inset-0 -z-10 lg:hidden bg-gradient-to-br from-medical-bg via-white to-medical-bg" />

                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px] animate-fade-in-up delay-100 relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
