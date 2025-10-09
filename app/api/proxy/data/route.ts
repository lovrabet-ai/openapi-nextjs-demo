import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/sdk-client";

/**
 * API 路由：中转调用 OpenAPI
 * GET /api/proxy/data
 *
 * 使用第0个数据集进行测试
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "10";

    // 创建服务端客户端
    const client = createServerClient();

    // 使用第0个数据集（getModel(0)）
    const model = client.getModel(0);

    // 调用 SDK 获取数据
    const response = await model.getList({
      page: parseInt(page),
      pageSize: parseInt(size),
    });

    // SDK 直接返回 data 字段的内容
    const apiData = response as {
      paging: {
        pageSize: number;
        totalCount: number;
        currentPage: number;
      };
      tableData: Record<string, unknown>[];
      tableColumns: { title: string; dataIndex: string }[];
    };

    return NextResponse.json({
      success: true,
      data: apiData,
    });
  } catch (error) {
    console.error("API proxy error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}