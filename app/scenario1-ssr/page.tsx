/**
 * 场景1：Next.js 服务端渲染 (SSR)
 *
 * 数据在服务端获取，然后渲染成 HTML 返回给客户端
 * 使用 Suppliers 数据集进行演示
 */

import { createServerClient } from "@/lib/sdk-client";
import ScenarioLayout from "../components/ScenarioLayout";
import type { ApiResponse, Supplier } from "./types";
import PageContent from "./PageContent";

// 服务端获取数据
async function fetchSuppliersInfo() {
  "use server";

  try {
    // 创建服务端客户端（使用 accessKey）
    const client = createServerClient();
    // 使用 Suppliers 模型
    const model = client.getModel("Suppliers");
    // 调用 SDK 获取数据列表 - SDK 直接返回 data 字段的内容
    const response = (await model.getList()) as unknown as ApiResponse<Supplier>["data"];

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
  const result = await fetchSuppliersInfo();

  return (
    <ScenarioLayout>
      <PageContent result={result} />
    </ScenarioLayout>
  );
}
