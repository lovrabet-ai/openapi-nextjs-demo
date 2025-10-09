import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/sdk-client';

/**
 * 订单 API 代理
 *
 * GET /api/proxy/orders - 获取订单列表
 * POST /api/proxy/orders - 创建订单
 */

// GET - 获取订单列表
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

    // 调用 SDK
    const response = await client.models.Orders.getList(params);

    // 返回数据（可以在这里做额外的处理）
    return NextResponse.json({
      success: true,
      data: response.tableData || [],
      total: response.paging?.total || 0,
      page: response.paging?.page || page,
      size: response.paging?.size || size
    });

  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders'
      },
      { status: 500 }
    );
  }
}

// POST - 创建订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必需字段
    if (!body.userId || !body.amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId and amount are required'
        },
        { status: 400 }
      );
    }

    // 创建服务端客户端
    const client = createServerClient();

    // 生成订单号
    const orderNo = `ORD${Date.now()}`;

    // 创建订单数据
    const orderData = {
      orderNo,
      userId: body.userId,
      amount: body.amount,
      status: body.status || 'pending',
      createdAt: new Date().toISOString()
    };

    // 调用 SDK 创建订单
    const response = await client.models.Orders.create(orderData);

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order'
      },
      { status: 500 }
    );
  }
}