"use client";

/**
 * 场景3：通过后端 API 中转
 *
 * 1. 前端调用 Next.js 的 API 路由
 * 2. API 路由在后端使用 SDK 调用 OpenAPI
 * 3. 将结果返回给前端
 * 4. 适合需要额外处理或权限控制的场景
 */

import { useState } from "react";
import DataTable from "./DataTable";
import ScenarioLayout from "../components/ScenarioLayout";
import { Button, Alert, Card, Typography, Space, Empty } from "antd";

const { Title, Text } = Typography;

interface TableColumn {
  title: string;
  dataIndex: string;
}

// API 响应数据结构
interface ApiResponse {
  success: boolean;
  data?: {
    paging: {
      pageSize: number;
      totalCount: number;
      currentPage: number;
    };
    tableData: Record<string, unknown>[];
    tableColumns: TableColumn[];
  };
  error?: string;
}

export default function Scenario3ProxyPage() {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 通过 API 中转获取数据
  const fetchData = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      const response = await fetch(`/api/proxy/data?${queryParams}`);

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setData(result.data.tableData || []);
        setColumns(result.data.tableColumns || []);
        setTotal(result.data.paging?.totalCount || 0);
        setCurrentPage(result.data.paging?.currentPage || 1);
        setPageSize(result.data.paging?.pageSize || 10);
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchData(page, pageSize);
  };

  return (
    <ScenarioLayout>
      <div style={{ padding: 24 }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Title level={2}>场景3：API 中转模式</Title>

          <Alert
            message="工作原理"
            description={
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>前端调用 Next.js API Routes（/api/proxy/data）</li>
                <li>API Routes 在服务端使用 accessKey 认证</li>
                <li>服务端调用 OpenAPI 获取数据（使用第0个数据集）</li>
                <li>可以添加额外的业务逻辑、权限控制、数据转换等</li>
                <li>适合需要服务端处理的场景</li>
              </ul>
            }
            type="info"
            showIcon
          />

          {/* 操作按钮 */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => fetchData(currentPage, pageSize)}
              loading={loading}
            >
              获取数据
            </Button>
          </div>

          {/* 错误信息 */}
          {error && (
            <Alert
              message="错误"
              description={error}
              type="error"
              showIcon
            />
          )}

          {/* 数据表格 */}
          {(data.length > 0 || columns.length > 0) && (
            <DataTable
              data={data}
              columns={columns}
              total={total}
              currentPage={currentPage}
              pageSize={pageSize}
              loading={loading}
              onPageChange={handlePageChange}
            />
          )}

          {/* 提示信息 */}
          {data.length === 0 && columns.length === 0 && !loading && !error && (
            <Card>
              <Empty description="暂无数据，请点击【获取数据】按钮" />
            </Card>
          )}
        </Space>
      </div>
    </ScenarioLayout>
  );
}