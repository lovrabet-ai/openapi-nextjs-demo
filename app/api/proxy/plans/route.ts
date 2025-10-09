import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/sdk-client';

/**
 * 学习计划 API 代理
 *
 * GET /api/proxy/plans - 获取学习计划列表
 * POST /api/proxy/plans - 创建学习计划
 */

// GET - 获取学习计划列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const size = Number(searchParams.get('size')) || 10;
    const status = searchParams.get('status');

    // 创建服务端客户端
    const client = createServerClient();

    // 构建查询参数
    const params: any = {
      page,
      size
    };

    // 如果有状态过滤
    if (status && status !== 'all') {
      params.filters = {
        status
      };
    }

    // 调用 SDK 获取 UserPlan 数据
    const response = await client.models.UserPlan.getList(params);

    // 返回数据（可以在这里做额外的处理）
    return NextResponse.json({
      success: true,
      data: (response as any).tableData || [],
      total: (response as any).paging?.total || 0,
      page: (response as any).paging?.page || page,
      size: (response as any).paging?.size || size
    });

  } catch (error) {
    console.error('Plans API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch plans'
      },
      { status: 500 }
    );
  }
}

// POST - 创建学习计划
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必需字段
    if (!body.user_id || !body.plan_name) {
      return NextResponse.json(
        {
          success: false,
          error: 'user_id and plan_name are required'
        },
        { status: 400 }
      );
    }

    // 创建服务端客户端
    const client = createServerClient();

    // 创建学习计划数据
    const planData = {
      user_id: body.user_id,
      plan_name: body.plan_name,
      plan_type: body.plan_type || 'daily',
      target_chars: body.target_chars || 100,
      completed_chars: 0,
      daily_target: body.daily_target || 10,
      start_date: new Date().toISOString(),
      status: body.status || 'active',
      created_at: new Date().toISOString()
    };

    // 调用 SDK 创建学习计划
    const response = await client.models.UserPlan.create(planData);

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Create Plan Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create plan'
      },
      { status: 500 }
    );
  }
}