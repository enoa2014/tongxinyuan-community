
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { pb } from "@/lib/pocketbase"

const formSchema = z.object({
    email: z.string().email({
        message: "请输入有效的邮箱地址",
    }),
    password: z.string().min(6, {
        message: "密码至少 6 位",
    }),
})

export default function AdminLoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            // PocketBase Auth (v0.23+ uses _superusers collection)
            const authData = await pb.collection('_superusers').authWithPassword(values.email, values.password)

            // Set cookie for middleware (optional, PB SDK uses local storage by default but Next.js middleware can't see LS)
            // For now, we rely on PB client-side auth state for rendering, 
            // but for Middleware protection we need a cookie. 
            // PocketBase automatically sets a cookie if configured, or we set it manually.
            // exportToCookie returns the full string "pb_auth=token; ..."
            const cookie = pb.authStore.exportToCookie({ httpOnly: false });
            document.cookie = cookie + (cookie.includes('path=') ? '' : '; path=/');

            toast({
                title: "Login Success",
                description: `Welcome back, Admin.`,
            })

            router.push("/admin/dashboard")
        } catch (error) {
            console.error("Login failed:", error)
            toast({
                variant: "destructive",
                title: "登录失败",
                description: "邮箱或密码错误，请重试。",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-lg border border-slate-100">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10">
                        <ShieldCheck className="h-6 w-6 text-brand-green" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                        Admin Login
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        仅限同心源工作人员访问
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="admin@tongxy.xyz" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-brand-green text-white hover:bg-brand-green/90" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign in
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
