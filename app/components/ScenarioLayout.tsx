"use client";

import ScenarioNav from "./ScenarioNav";
import { ConfigProvider, Layout } from "antd";
import zhCN from "antd/locale/zh_CN";
import { ReactNode } from "react";

const { Sider, Content } = Layout;

interface ScenarioLayoutProps {
  children: ReactNode;
}

export default function ScenarioLayout({ children }: ScenarioLayoutProps) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 6,
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          width={256}
          style={{
            background: "#fff",
            boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
          }}
        >
          <ScenarioNav />
        </Sider>
        <Content
          style={{
            background: "#f0f2f5",
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}