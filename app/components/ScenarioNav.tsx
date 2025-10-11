"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Typography, Space } from "antd";
import type { MenuProps } from "antd";
import {
  CloudServerOutlined,
  GlobalOutlined,
  ApiOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

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
    <div style={{ height: "100%" }}>
      <div
        style={{
          padding: "20px 16px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Space direction="vertical" size={0}>
          <Title level={4} style={{ margin: 0 }}>
            Next.js SDK Demo
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            OpenAPI 调用示例
          </Text>
        </Space>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={items}
        style={{
          border: "none",
          height: "calc(100% - 84px)",
        }}
      />
    </div>
  );
}