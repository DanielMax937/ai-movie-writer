import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 编剧室 - 虚拟编剧团队",
  description: "多智能体协作创作电影剧本，体验 AI 驱动的创意写作过程",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
