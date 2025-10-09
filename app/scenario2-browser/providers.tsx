"use client";

import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { ReactNode } from "react";

export function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          // 自定义主题色
          colorPrimary: "#1890ff",
          borderRadius: 6,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}