"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import {
  CloudServerOutlined,
  GlobalOutlined,
  ApiOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const items: MenuProps["items"] = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: <Link href="/">首页</Link>,
  },
  {
    key: "/scenario1-ssr",
    icon: <CloudServerOutlined />,
    label: <Link href="/scenario1-ssr">场景1: SSR 模式</Link>,
  },
  {
    key: "/scenario2-browser",
    icon: <GlobalOutlined />,
    label: <Link href="/scenario2-browser">场景2: 浏览器直连</Link>,
  },
  {
    key: "/scenario3-proxy",
    icon: <ApiOutlined />,
    label: <Link href="/scenario3-proxy">场景3: API 中转</Link>,
  },
];

export default function ScenarioNav() {
  const pathname = usePathname();

  return (
    <div className="h-full bg-white border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Next.js SDK Demo
        </h2>
        <p className="text-sm text-gray-600 mt-1">OpenAPI 调用示例</p>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={items}
        className="h-full border-r-0"
        style={{ minHeight: "calc(100vh - 88px)" }}
      />
    </div>
  );
}