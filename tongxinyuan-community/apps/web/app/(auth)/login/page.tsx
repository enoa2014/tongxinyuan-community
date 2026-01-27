"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Lock, Phone, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("family")

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        // Simulate API call
        // Simulate API call and redirect based on role
        setTimeout(() => {
            setIsLoading(false)
            if (activeTab === 'family') {
                router.push("/dashboard/family")
            } else if (activeTab === 'volunteer') {
                router.push("/dashboard/volunteer")
            } else {
                router.push("/dashboard/worker")
            }
        }, 1000)
    }

    return (

        <div className="flex flex-col space-y-5 text-center font-sans">
            <div className="space-y-2">
                <h1 className="text-3xl font-heading font-bold tracking-tight text-medical-primary">
                    欢迎回家
                </h1>
                <p className="text-sm text-medical-text/70 font-medium">
                    请选择您的身份登录平台
                </p>
            </div>

            <Card className="border-0 shadow-xl shadow-medical-primary/10 bg-white/90 backdrop-blur-sm overflow-hidden rounded-2xl">
                <CardContent className="p-6">
                    <Tabs defaultValue="family" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 mb-6 h-10 p-1 bg-medical-bg rounded-xl">
                            <TabsTrigger
                                value="family"
                                className="rounded-lg text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-medical-primary data-[state=active]:shadow-sm text-slate-500 hover:text-medical-primary/80"
                            >
                                <div className="flex items-center gap-2">
                                    <Users className={`h-4 w-4 transition-transform duration-300 ${activeTab === 'family' ? 'scale-110' : ''}`} />
                                    <span>患儿家庭</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="volunteer"
                                className="rounded-lg text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-Medical-secondary data-[state=active]:shadow-sm text-slate-500 hover:text-medical-primary/80"
                            >
                                <div className="flex items-center gap-2">
                                    <User className={`h-4 w-4 transition-transform duration-300 ${activeTab === 'volunteer' ? 'scale-110' : ''}`} />
                                    <span>志愿者</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>

                        {/* Family Form */}
                        <TabsContent value="family" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <form onSubmit={onSubmit}>
                                <div className="grid gap-4">
                                    <div className="grid gap-1.5 text-left group">
                                        <Label htmlFor="phone" className="text-xs font-semibold text-medical-text ml-1">手机号码</Label>
                                        <div className="relative transition-all duration-300 focus-within:transform focus-within:scale-[1.01]">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-medical-primary transition-colors" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="请输入手机号"
                                                className="pl-9 h-10 text-sm bg-slate-50 border-slate-200 focus-visible:ring-medical-primary/20 focus-visible:border-medical-primary transition-all rounded-lg"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1.5 text-left group">
                                        <Label htmlFor="code" className="text-xs font-semibold text-medical-text ml-1">验证码</Label>
                                        <div className="flex gap-3">
                                            <div className="relative flex-1 transition-all duration-300 focus-within:transform focus-within:scale-[1.01]">
                                                <Input
                                                    id="code"
                                                    placeholder="6位数字"
                                                    className="h-10 text-sm bg-slate-50 border-slate-200 text-center tracking-[0.2em] font-medium focus-visible:ring-medical-primary/20 focus-visible:border-medical-primary transition-all rounded-lg"
                                                    required
                                                />
                                            </div>
                                            <Button type="button" variant="outline" className="w-28 h-10 text-sm font-medium border-slate-200 hover:bg-white hover:text-medical-primary hover:border-medical-primary rounded-lg transition-all">
                                                获取验证码
                                            </Button>
                                        </div>
                                    </div>
                                    <Button className="w-full h-10 mt-2 bg-medical-cta hover:bg-green-600 text-white font-bold tracking-wide rounded-lg shadow-lg shadow-medical-cta/20 hover:shadow-medical-cta/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]" disabled={isLoading}>
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>登录中...</span>
                                            </div>
                                        ) : "立即登录"}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>

                        {/* Volunteer Form */}
                        <TabsContent value="volunteer" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <form onSubmit={onSubmit}>
                                <div className="grid gap-4">
                                    <div className="grid gap-1.5 text-left group">
                                        <Label htmlFor="vol-account" className="text-xs font-semibold text-medical-text ml-1">账号</Label>
                                        <div className="relative transition-all duration-300 focus-within:transform focus-within:scale-[1.01]">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-medical-primary transition-colors" />
                                            <Input
                                                id="vol-account"
                                                placeholder="用户名/手机号"
                                                className="pl-9 h-10 text-sm bg-slate-50 border-slate-200 focus-visible:ring-medical-primary/20 focus-visible:border-medical-primary transition-all rounded-lg"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1.5 text-left group">
                                        <Label htmlFor="password" className="text-xs font-semibold text-medical-text ml-1">密码</Label>
                                        <div className="relative transition-all duration-300 focus-within:transform focus-within:scale-[1.01]">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-medical-primary transition-colors" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="请输入密码"
                                                className="pl-9 h-10 text-sm bg-slate-50 border-slate-200 focus-visible:ring-medical-primary/20 focus-visible:border-medical-primary transition-all rounded-lg"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button className="w-full h-10 mt-2 bg-medical-secondary hover:bg-cyan-400 text-white font-bold tracking-wide rounded-lg shadow-lg shadow-medical-secondary/20 hover:shadow-medical-secondary/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]" disabled={isLoading}>
                                        <div className="flex items-center justify-center gap-2">
                                            {isLoading ? "登录中..." : "进入工作台"}
                                            {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                                        </div>
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                                快速登录
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        type="button"
                        className="w-full h-10 border border-slate-200 hover:bg-medical-bg hover:text-medical-primary hover:border-medical-primary/30 rounded-lg transition-all duration-300 group"
                        onClick={() => alert("WeChat Login Mock")}
                    >
                        <svg className="mr-2 h-5 w-5 text-[#07C160] transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.604 3.39c-4.752 0-8.604 3.515-8.604 7.848 0 2.454 1.236 4.654 3.195 6.138.384.288.312.924.132 1.488-.192.612-.66 1.704-.756 1.968-.132.324.276.54.492.3.936-1.008 2.052-2.316 2.316-2.58.156-.156.408-.192.624-.132.852.288 1.764.456 2.712.456.12 0 .228-.012.348-.012-3.132-2.136-3.84-6.396-1.02-9.612 1.056-1.188 2.508-2.028 4.14-2.28-1.08-.948-2.388-1.572-3.588-1.572zm12.336 21.012c-.168.216-.492.036-.384-.216.072-.216.444-1.08.6-1.572.132-.432.192-.936-.108-1.152-1.536-1.164-2.508-2.892-2.508-4.812 0-3.396 3.036-6.156 6.78-6.156 3.744 0 6.78 2.76 6.78 6.156 0 3.396-3.036 6.156-6.78 6.156-.744 0-1.452-.12-2.124-.348-.168-.048-.36-.024-.48.096-.204.204-1.08 1.224-1.812 2.016.012 0 .024-.108.036-.168z" /></svg>
                        <span className="font-medium text-sm">微信一键授权</span>
                    </Button>
                </CardContent>
            </Card>

            <p className="px-8 text-center text-xs text-medical-text/50 transform -translate-y-2">
                登录即代表您同意 <Link href="/terms" className="hover:text-medical-primary hover:underline transition-colors">服务协议</Link> 和 <Link href="/privacy" className="hover:text-medical-primary hover:underline transition-colors">隐私政策</Link>
            </p>
        </div>
    )
}
