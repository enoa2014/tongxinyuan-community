import { cn } from "@/lib/utils"

interface InnerPageWrapperProps {
    children: React.ReactNode
    className?: string
    title?: string
    subtitle?: string
    imageUrl?: string
}

export function InnerPageWrapper({ children, className, title, subtitle, imageUrl }: InnerPageWrapperProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Optional Hero Section */}
            {title && (
                <div className="bg-slate-900 pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
                    {/* Background Overlay or Image */}
                    <div className="absolute inset-0 z-0">
                        {imageUrl ? (
                            // In a real app we would use Next/Image here but for flexibility with generic URLs we use img or div bg
                            <div className="w-full h-full bg-cover bg-center opacity-80" style={{ backgroundImage: `url('${imageUrl}')` }}></div>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-brand-green/30 to-blue-900/30"></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/30"></div>
                    </div>

                    <div className="container mx-auto px-6 md:px-12 relative z-10 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed drop-shadow-sm">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={cn("container mx-auto px-6 md:px-12", title ? "py-12" : "pt-32 pb-12", className)}>
                {children}
            </div>
        </div>
    )
}
