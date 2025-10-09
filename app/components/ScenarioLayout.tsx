"use client";

import ScenarioNav from "./ScenarioNav";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { ReactNode } from "react";

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
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 flex-shrink-0">
          <ScenarioNav />
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </ConfigProvider>
  );
}