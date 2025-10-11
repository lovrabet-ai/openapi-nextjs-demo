import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AntdRegistry from "./AntdRegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lovrabet SDK Next.js 演示",
  description: "使用 Next.js 15 和 Lovrabet SDK 的演示项目",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ margin: 0, padding: 0 }}
      >
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
