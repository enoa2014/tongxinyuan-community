export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold tracking-tight">工作台概览</h1>
            <p className="text-slate-500">
                欢迎回来，这是您的同心源工作台。
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold leading-none tracking-tight">待办事项</h3>
                    <p className="text-sm text-muted-foreground mt-2">您有 3 个新的入住申请待审批。</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold leading-none tracking-tight">今日活动</h3>
                    <p className="text-sm text-muted-foreground mt-2">下午 2:00 - 儿童绘画手工课</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold leading-none tracking-tight">系统公告</h3>
                    <p className="text-sm text-muted-foreground mt-2">系统将于今晚进行维护。</p>
                </div>
            </div>
        </div>
    )
}
