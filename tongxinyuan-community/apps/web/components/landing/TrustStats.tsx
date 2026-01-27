import { Users, Clock, Smile } from "lucide-react"

export function TrustStats() {
    const stats = [
        {
            value: "3,124",
            label: "已服务家庭",
            desc: "累计接待异地求医家庭",
            icon: Users
        },
        {
            value: "52,400+",
            label: "志愿服务小时",
            desc: "志愿者无私奉献",
            icon: Clock
        },
        {
            value: "100%",
            label: "公益免费",
            desc: "对困难家庭不收取租金",
            icon: Smile
        }
    ]

    return (
        <section className="py-16 bg-slate-50 border-y border-slate-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="mb-4 p-4 bg-teal-50 rounded-full text-teal-600">
                                <stat.icon className="h-8 w-8" />
                            </div>
                            <div className="text-4xl font-extrabold text-slate-900 mb-2 font-heading">
                                {stat.value}
                            </div>
                            <div className="text-lg font-semibold text-slate-700 mb-1">
                                {stat.label}
                            </div>
                            <div className="text-sm text-slate-500">
                                {stat.desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
