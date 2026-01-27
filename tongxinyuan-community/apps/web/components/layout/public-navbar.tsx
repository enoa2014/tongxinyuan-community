"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function PublicNavbar() {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY
            setIsScrolled(offset > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const isHome = pathname === "/"

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome
                ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm p-1">
                        {/* Fallback to text/icon if image fails, but here we use the image */}
                        <img
                            src="/logo.png"
                            alt="同心源 Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <span className={`text-xl font-heading font-bold tracking-tight transition-colors duration-300 ${isScrolled || !isHome ? "text-slate-900" : "text-white text-shadow-sm"
                        }`}>
                        同心源
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className={`text-sm font-medium transition-colors hover:opacity-80 ${isScrolled || !isHome ? "text-slate-700" : "text-white/90"
                            }`}
                    >
                        首页
                    </Link>
                    <Link
                        href="/about"
                        className={`text-sm font-medium transition-colors hover:opacity-80 ${isScrolled || !isHome ? "text-slate-700" : "text-white/90"
                            }`}
                    >
                        关于我们
                    </Link>
                    <Link
                        href="/stories"
                        className={`text-sm font-medium transition-colors hover:opacity-80 ${isScrolled || !isHome ? "text-slate-700" : "text-white/90"
                            }`}
                    >
                        我们的故事
                    </Link>
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Button
                        variant={isScrolled || !isHome ? "outline" : "secondary"}
                        className={`font-semibold rounded-full px-6 ${!isScrolled && isHome ? "bg-white/10 border-transparent text-white hover:bg-white/20" : "border-slate-200"
                            }`}
                        asChild
                    >
                        <Link href="/login">
                            登录
                        </Link>
                    </Button>
                    <Button
                        className="rounded-full px-6 font-bold shadow-lg shadow-medical-cta/20 bg-medical-cta hover:bg-green-600 text-white border-0"
                        asChild
                    >
                        <Link href="/support">
                            加入我们
                        </Link>
                    </Button>
                </div>

                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className={`h-6 w-6 ${isScrolled || !isHome ? "text-slate-900" : "text-white"}`} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <div className="flex flex-col gap-6 mt-10">
                            <Link href="/" className="text-lg font-medium">首页</Link>
                            <Link href="/about" className="text-lg font-medium">关于我们</Link>
                            <Link href="/stories" className="text-lg font-medium">我们的故事</Link>
                            <div className="h-px bg-slate-100 my-2" />
                            <Link href="/login" className="text-lg font-medium text-slate-600">登录</Link>
                            <Link href="/support" className="text-lg font-medium text-medical-cta font-bold">加入我们</Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
