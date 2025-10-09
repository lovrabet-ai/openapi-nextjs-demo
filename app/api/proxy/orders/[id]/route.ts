import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/sdk-client';

/**
 * 单个订单操作 API
 *
 * DELETE /api/proxy/orders/[id] - 删除订单
 * GET /api/proxy/orders/[id] - 获取订单详情
 * PUT /api/proxy/orders/[id] - 更新订单
 */

// DELETE - 删除订单
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // 创建服务端客户端
    const client = createServerClient();

    // 调用 SDK 删除订单
    await client.models.Orders.delete(orderId);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete Order Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete order'
      },
      { status: 500 }
    );
  }
}

// GET - 获取订单详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // 创建服务端客户端
    const client = createServerClient();

    // 调用 SDK 获取订单详情
    const order = await client.models.Orders.get(orderId);

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get Order Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get order'
      },
      { status: 500 }
    );
  }
}

// PUT - 更新订单
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const body = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // 创建服务端客户端
    const client = createServerClient();

    // 调用 SDK 更新订单
    const updatedOrder = await client.models.Orders.update(orderId, body);

    return NextResponse.json({
      success: true,
      data: updatedOrder
    });

  } catch (error) {
    console.error('Update Order Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update order'
      },
      { status: 500 }
    );
  }
}