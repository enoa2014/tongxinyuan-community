
"use client"

import React, { forwardRef } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface PosterPreviewProps {
    data: {
        project_name: string
        donor_name: string
        amount: string
        donate_date: Date | undefined
        description: string
        images: string[] // Object URLs for preview
    }
}

export const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(({ data }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[375px] min-h-[667px] bg-white relative overflow-hidden flex flex-col items-center pb-8"
            style={{ boxShadow: "0 0 20px rgba(0,0,0,0.1)" }}
        >
            {/* Header / Brand Banner */}
            <div className="w-full h-24 bg-[#B22222] flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <h1 className="text-white text-2xl font-bold tracking-widest z-10 font-serif">
                    同心源·爱心公示
                </h1>
                <div className="absolute bottom-0 w-full h-1 bg-[#FFD700]"></div>
            </div>

            {/* Donation Badge */}
            <div className="mt-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#B22222] text-white flex items-center justify-center text-xl font-bold border-4 border-[#FFD700]">
                    捐
                </div>
                <div className="mt-2 text-[#B22222] font-bold text-lg tracking-wide">
                    爱心捐赠
                </div>
            </div>

            {/* Main Content Card */}
            <div className="w-[90%] mt-6 bg-[#FFF8F0] border border-[#E6CBA8] rounded-lg p-6 relative">
                {/* ID / Date Tag */}
                <div className="absolute -top-3 left-4 bg-[#B22222] text-[#FFD700] px-3 py-1 text-xs rounded-full font-bold shadow-sm">
                    {data.donate_date ? format(data.donate_date, "yyyy年MM月dd日", { locale: zhCN }) : "日期未定"}
                </div>

                {/* Project Title */}
                <h2 className="mt-3 text-xl font-bold text-[#333] border-b-2 border-[#E6CBA8] pb-2 mb-4">
                    {data.project_name || "项目名称"}
                </h2>

                {/* Donor Info */}
                <div className="space-y-3">
                    <div className="flex items-start">
                        <span className="text-[#8B4513] font-bold min-w-[70px]">捐赠方：</span>
                        <span className="text-[#333] font-medium break-words flex-1">
                            {data.donor_name || "捐赠单位/个人"}
                        </span>
                    </div>

                    <div className="flex items-start">
                        <span className="text-[#8B4513] font-bold min-w-[70px]">捐赠内容：</span>
                        <span className="text-[#B22222] font-bold break-words flex-1 text-lg">
                            {data.amount || "金额/物资"}
                        </span>
                    </div>

                    {data.description && (
                        <div className="mt-4 text-sm text-[#666] leading-relaxed border-t border-dashed border-[#E6CBA8] pt-3">
                            {data.description}
                        </div>
                    )}
                </div>
            </div>

            {/* Images Grid */}
            {data.images.length > 0 && (
                <div className="w-[90%] mt-4 grid grid-cols-1 gap-3">
                    {data.images.map((img, idx) => (
                        <div key={idx} className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-[#E6CBA8]">
                            <Image
                                src={img}
                                alt={`evidence-${idx}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Footer / QR Code */}
            <div className="mt-auto pt-8 w-full flex flex-col items-center">
                <div className="w-[80%] border-t border-[#E6CBA8] mb-4"></div>
                <div className="text-[#8B4513] text-sm font-bold mb-2">感谢您的每一份支持</div>
                <div className="w-24 h-24 bg-gray-200 border border-[#E6CBA8] flex items-center justify-center text-xs text-gray-400">
                    [公众号二维码]
                </div>
                <div className="mt-2 text-xs text-[#999]">
                    北京同心源社区支持中心
                </div>
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#FFD700] rounded-tr-xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#FFD700] rounded-bl-xl opacity-50"></div>
        </div>
    )
})

PosterPreview.displayName = "PosterPreview"
