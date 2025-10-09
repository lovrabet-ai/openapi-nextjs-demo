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
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">场景3：API 中转模式</h1>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-2">
          工作原理
        </h2>
        <ul className="list-disc list-inside text-purple-800 space-y-1">
          <li>前端调用 Next.js API Routes（/api/proxy/data）</li>
          <li>API Routes 在服务端使用 accessKey 认证</li>
          <li>服务端调用 OpenAPI 获取数据（使用第0个数据集）</li>
          <li>可以添加额外的业务逻辑、权限控制、数据转换等</li>
          <li>适合需要服务端处理的场景</li>
        </ul>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => fetchData(currentPage, pageSize)}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "加载中..." : "获取数据"}
        </button>
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-900">错误</h3>
          <p className="text-red-700">{error}</p>
        </div>
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
          <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600">
            <p>暂无数据，请点击"获取数据"按钮</p>
          </div>
        )}
      </div>
    </ScenarioLayout>
  );
}