"use client";

import { Typography, Alert, Space, Card } from "antd";
import { CreateButton } from "./SupplierFormButtons";
import UserTable from "./UserTable";

const { Title, Paragraph } = Typography;

interface TableColumn {
  title: string;
  dataIndex: string;
}

interface PageContentProps {
  result: {
    success: boolean;
    data: Record<string, unknown>[];
    columns: TableColumn[];
    total: number;
    currentPage: number;
    pageSize: number;
    error?: string;
  };
}

export default function PageContent({ result }: PageContentProps) {
  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={2}>场景1：服务端渲染（SSR）</Title>

        <Alert
          message="工作原理"
          description={
            <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
              <li>页面在 Next.js 服务端渲染</li>
              <li>使用 accessKey 认证</li>
              <li>直接调用 OpenAPI 获取数据</li>
              <li>使用 Suppliers 数据集（供应商管理）</li>
              <li>安全：密钥只在服务端使用，不暴露给客户端</li>
              <li>✨ 支持 Create 和 Update 操作（Server Actions）</li>
            </ul>
          }
          type="info"
          showIcon
        />

        {result.success ? (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {/* Create 按钮 */}
            <CreateButton columns={result.columns} />

            <UserTable
              data={result.data}
              columns={result.columns}
              total={result.total}
              currentPage={result.currentPage}
              pageSize={result.pageSize}
            />

            <Card title="调试信息" size="small">
              <pre style={{ fontSize: 12, overflow: "auto", margin: 0 }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </Card>
          </Space>
        ) : (
          <Alert
            message="错误"
            description={
              <>
                <Paragraph>{result.error}</Paragraph>
                <Paragraph type="secondary">
                  请检查环境变量配置和网络连接
                </Paragraph>
              </>
            }
            type="error"
            showIcon
          />
        )}
      </Space>
    </div>
  );
}
