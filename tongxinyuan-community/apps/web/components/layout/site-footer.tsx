export function SiteFooter() {
    return (
        <footer className="bg-slate-50 border-t border-slate-100 py-12 font-sans">
            <div className="container text-center md:text-left">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-heading font-bold text-lg text-slate-900">同心源社区</h3>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto md:mx-0">
                            连接爱与希望，为异地求医的大病儿童家庭提供温暖的港湾。
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">关于</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li>我们的使命</li>
                            <li>团队介绍</li>
                            <li>透明度报告</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">参与</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li>成为志愿者</li>
                            <li>合作伙伴</li>
                            <li>物资捐赠</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">联系</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li>support@tongxinyuan.org</li>
                            <li>+86 123-4567-8900</li>
                            <li>北京市...</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                    &copy; 2026 Tongxinyuan Social Work Service Center. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
