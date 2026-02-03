"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Heart, Menu, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    const textColor = isScrolled || !isHome ? "text-slate-700" : "text-white/90"
    const hoverColor = isScrolled || !isHome ? "hover:text-brand-green" : "hover:text-white"
    const logoText = isScrolled || !isHome ? "text-slate-900" : "text-white text-shadow-sm"

    // Navbar background transition
    const navbarBg = isScrolled || !isHome
        ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
        : "bg-transparent py-5"

    const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
        <Link
            href={href}
            className={`text-sm font-medium transition-colors ${textColor} ${hoverColor}`}
        >
            {children}
        </Link>
    )

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}>
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm p-1">
                        <img
                            src="/logo.png"
                            alt="同心源 Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <span className={`text-xl font-heading font-bold tracking-tight transition-colors duration-300 ${logoText}`}>
                        同心源
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    <NavLink href="/">首页</NavLink>

                    {/* Drodown: About Us */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className={`flex items-center gap-1 text-sm font-medium outline-none transition-colors ${textColor} ${hoverColor} data-[state=open]:text-brand-green`}>
                            关于我们 <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 p-2">
                            <DropdownMenuItem asChild>
                                <Link href="/about" className="cursor-pointer w-full font-medium">机构介绍</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/services" className="cursor-pointer w-full font-medium">服务中心</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/transparency" className="cursor-pointer w-full font-medium text-brand-green/90">公益透明</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dropdown: Activities & Content */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className={`flex items-center gap-1 text-sm font-medium outline-none transition-colors ${textColor} ${hoverColor} data-[state=open]:text-brand-green`}>
                            资讯与活动 <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 p-2">
                            <DropdownMenuItem asChild>
                                <Link href="/stories" className="cursor-pointer w-full font-medium">社区故事</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/activities" className="cursor-pointer w-full font-medium">公益活动</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`font-medium ${isScrolled || !isHome ? "text-slate-600 hover:text-slate-900" : "text-white/80 hover:text-white hover:bg-white/10"}`}
                        asChild
                    >
                        <Link href="/login">
                            登录
                        </Link>
                    </Button>

                    <Button
                        variant={isScrolled || !isHome ? "outline" : "secondary"}
                        className={`font-semibold rounded-full hidden lg:flex ${!isScrolled && isHome ? "bg-white/10 border-transparent text-white hover:bg-white/20" : "border-brand-green/30 text-brand-green hover:bg-brand-green/5"}`}
                        asChild
                    >
                        <Link href="/donate">
                            支持我们
                        </Link>
                    </Button>
                    <Button
                        className="rounded-full px-5 font-bold shadow-lg shadow-brand-green/20 bg-brand-green hover:bg-brand-green/90 text-white border-0"
                        asChild
                    >
                        <Link href="/get-involved">
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
                    <SheetContent side="right" className="w-[300px]">
                        <div className="flex flex-col gap-6 mt-8">
                            <Link href="/" className="text-lg font-medium border-b pb-2">首页</Link>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">关于我们</h4>
                                <div className="flex flex-col gap-3 pl-2">
                                    <Link href="/about" className="text-base font-medium text-slate-700">机构介绍</Link>
                                    <Link href="/services" className="text-base font-medium text-slate-700">服务中心</Link>
                                    <Link href="/transparency" className="text-base font-medium text-brand-green">公益透明</Link>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">资讯与活动</h4>
                                <div className="flex flex-col gap-3 pl-2">
                                    <Link href="/stories" className="text-base font-medium text-slate-700">社区故事</Link>
                                    <Link href="/activities" className="text-base font-medium text-slate-700">公益活动</Link>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 my-2" />

                            <div className="flex flex-col gap-3">
                                <Button className="w-full bg-brand-green font-bold" size="lg" asChild>
                                    <Link href="/get-involved">加入我们</Link>
                                </Button>
                                <Button variant="outline" className="w-full border-brand-green text-brand-green font-bold" size="lg" asChild>
                                    <Link href="/donate">支持我们</Link>
                                </Button>
                                <Button variant="ghost" className="w-full text-slate-500" asChild>
                                    <Link href="/login">管理员登录</Link>
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
