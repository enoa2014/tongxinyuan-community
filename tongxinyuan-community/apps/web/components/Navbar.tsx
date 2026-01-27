import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-primary/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                            同
                        </div>
                        <span className="font-display font-bold text-xl text-primary tracking-tight">
                            同心源
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-text hover:text-primary font-medium transition-colors">
                            首页
                        </Link>
                        <Link href="/help" className="text-text hover:text-primary font-medium transition-colors">
                            我要求助
                        </Link>
                        <Link href="/donate" className="text-text hover:text-primary font-medium transition-colors">
                            爱心捐赠
                        </Link>
                        <Link href="/volunteer" className="text-text hover:text-primary font-medium transition-colors">
                            志愿者报名
                        </Link>
                    </div>

                    {/* CTA Button */}
                    <div className="flex items-center">
                        <button className="bg-cta hover:bg-orange-600 text-white px-5 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-sm">
                            紧急求助
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
