export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                                同
                            </div>
                            <span className="font-display font-bold text-xl text-primary">同心源</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            致力于为异地求医的大病儿童家庭提供温暖的社区支持，让爱不再有距离。
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="font-bold text-text mb-4">服务项目</h4>
                        <ul className="space-y-3 text-slate-500 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">爱心住宿</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">共享厨房</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">政策辅导</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">社工探访</a></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="font-bold text-text mb-4">关于我们</h4>
                        <ul className="space-y-3 text-slate-500 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">机构介绍</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">透明度报告</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">联系我们</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">加入我们</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-text mb-4">联系方式</h4>
                        <ul className="space-y-3 text-slate-500 text-sm">
                            <li className="flex items-start gap-2">
                                <span>📍</span>
                                <span>北京市及各大省会儿童医院周边社区</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>📧</span>
                                <span>contact@tongxinyuan.org</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>📞</span>
                                <span>400-123-4567</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">
                        © 2026 同心源 (Tongxinyuan) Community Support Center. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {/* Social placeholders */}
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer transition-colors">
                            WX
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer transition-colors">
                            WB
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
