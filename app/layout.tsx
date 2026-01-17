import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 编剧室 - 虚拟编剧团队",
  description: "多智能体协作创作电影剧本，体验 AI 驱动的创意写作过程。通过导演、演员、总结员智能体的协作，自动生成完整的电影剧本。",
  keywords: [
    "AI",
    "screenplay",
    "scriptwriter",
    "multi-agent",
    "artificial intelligence",
    "creative writing",
    "movie script",
    "剧本创作",
    "人工智能",
    "多智能体",
  ],
  authors: [{ name: "AI ScriptWriter Team" }],
  creator: "AI ScriptWriter",
  publisher: "AI ScriptWriter",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: "AI 编剧室 - 虚拟编剧团队",
    description: "多智能体协作创作电影剧本，体验 AI 驱动的创意写作过程",
    siteName: "AI 编剧室",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 编剧室 - 虚拟编剧团队",
    description: "多智能体协作创作电影剧本，体验 AI 驱动的创意写作过程",
  },
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
