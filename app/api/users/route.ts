import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/sdk-client';

/**
 * 场景1: 服务器端直接 OpenAPI 调用
 * GET /api/users
 *
 * 服务器端使用 accessKey 直接调用 OpenAPI
 * 浏览器端只需调用这个 API 即可，无需处理认证
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageIndex, pageSize, queryField, queryOperator, queryValue } = body;

    // 创建 SDK 客户端 (使用服务器端配置的 accessKey)
    const client = createServerClient();

    // 调用 OpenAPI - 使用 models.UsersInfo 访问模型
    const response = await client.models.UsersInfo.getList({
      currentPage: pageIndex || 1,
      pageSize: pageSize || 10,
      queryField,
      queryOperator,
      queryValue
    });

    // 返回数据给浏览器 - response 已经是 ListResponse 格式
    return NextResponse.json(response);

  } catch (error) {
    console.error('Server-side API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users data' },
      { status: 500 }
    );
  }
}