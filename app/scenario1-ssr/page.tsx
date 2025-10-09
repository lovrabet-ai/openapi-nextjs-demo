/**
 * 场景1：Next.js 服务端直接调用 OpenAPI
 *
 * 使用真实数据集：UsersInfo (用户信息表)
 * 数据在服务端获取，然后渲染成 HTML 返回给客户端
 */

import { createServerClient } from "@/lib/sdk-client";
import UserTable from "./UserTable";
import ScenarioLayout from "../components/ScenarioLayout";

// 定义数据类型
interface TableColumn {
  title: string;
  dataIndex: string;
}

interface ApiResponse {
  msg?: string;
  data: {
    paging: {
      pageSize: number;
      totalCount: number;
      currentPage: number;
    };
    tableData: Record<string, unknown>[];
    tableColumns: TableColumn[];
  };
  success: boolean;
  errorMsg?: string;
  errorCode?: number;
}

// 服务端获取数据
async function fetchUsersInfo() {
  "use server";

  try {
    // 创建服务端客户端（使用 accessKey）
    const client = createServerClient();
    const model = client.getModel(1);
    // 调用 SDK 获取用户信息列表 - SDK 直接返回 data 字段的内容
    const response = (await model.getList()) as ApiResponse["data"];

    return {
      success: true,
      data: response?.tableData || [],
      columns: response?.tableColumns || [],
      total: response?.paging?.totalCount || 0,
      currentPage: response?.paging?.currentPage || 1,
      pageSize: response?.paging?.pageSize || 10,
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: [],
      columns: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
    };
  }
}

export default async function Scenario1SSRPage() {
  const result = await fetchUsersInfo();

  return (
    <ScenarioLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">场景1：服务端渲染（SSR）</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">工作原理</h2>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>页面在 Next.js 服务端渲染</li>
            <li>使用 accessKey 认证（ak-KgyJkUVr...）</li>
            <li>直接调用 OpenAPI 获取 UsersInfo 数据</li>
            <li>数据集：f8afbe3f6f12438dac556ebb3ae2c9cf</li>
            <li>安全：密钥只在服务端使用，不暴露给客户端</li>
          </ul>
        </div>

        {result.success ? (
          <>
            <UserTable
              data={result.data}
              columns={result.columns}
              total={result.total}
              currentPage={result.currentPage}
              pageSize={result.pageSize}
            />

            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">调试信息</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 mb-2">错误</h3>
            <p className="text-red-700">{result.error}</p>
            <p className="text-sm text-red-600 mt-2">
              请检查环境变量配置和网络连接
            </p>
          </div>
        )}
      </div>
    </ScenarioLayout>
  );
}
