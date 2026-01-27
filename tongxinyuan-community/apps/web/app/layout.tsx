import type { Metadata } from "next";
// import { Figtree, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

// const figtree = Figtree({
//   variable: "--font-figtree",
//   subsets: ["latin"],
//   display: "swap",
// });

// const notoSans = Noto_Sans_SC({
//   variable: "--font-noto-sans",
//   subsets: ["latin"],
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "同心源 (Tongxinyuan) Community Support",
  description: "关爱大病儿童家庭，提供住宿、饮食与政策支持",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`antialiased bg-background text-text font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
