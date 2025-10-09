import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/sdk-client';

/**
 * 单个学习计划操作 API
 *
 * DELETE /api/proxy/plans/[id] - 删除学习计划
 * GET /api/proxy/plans/[id] - 获取学习计划详情
 * PUT /api/proxy/plans/[id] - 更新学习计划
 */

// DELETE - 删除学习计划
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planId = params.id;

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // 创建服务端客户端
    const client = createServerClient();

    // 调用 SDK 删除学习计划
    await client.models.UserPlan.delete(planId);

    return NextResponse.json({
      success: true,
      message: 'Plan deleted successfully'
    });

  } catch (error) {
    console.error('Delete Plan Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete plan'
      },
      { status: 500 }
    );
  }
}

// GET - 获取学习计划详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planId = params.id;

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // 创建服务端客户端
    const client = createServerClient();

    // 调用 SDK 获取学习计划详情
    const plan = await client.models.UserPlan.getOne(planId);

    return NextResponse.json({
      success: true,
      data: plan
    });

  } catch (error) {
    console.error('Get Plan Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get plan'
      },
      { status: 500 }
    );
  }
}

// PUT - 更新学习计划
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planId = params.id;
    const body = await request.json();

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // 创建服务端客户端
    const client = createServerClient();

    // 调用 SDK 更新学习计划
    const updatedPlan = await client.models.UserPlan.update(planId, body);

    return NextResponse.json({
      success: true,
      data: updatedPlan
    });

  } catch (error) {
    console.error('Update Plan Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update plan'
      },
      { status: 500 }
    );
  }
}