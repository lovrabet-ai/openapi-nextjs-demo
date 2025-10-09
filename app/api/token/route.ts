import { NextRequest, NextResponse } from 'next/server';
import { generateOpenApiTokenForNextjs } from '@/lib/crypto-helper';
import { LOVRABET_APP_CODE } from '@/lib/sdk-client';
import { ACCESS_KEY } from '@/lib/sdk-client';

/**
 * Token 生成 API
 * POST /api/token
 *
 * 为浏览器端生成 token 和 timestamp 配对
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { datasetCode } = body;

    if (!datasetCode) {
      return NextResponse.json(
        { error: 'datasetCode is required' },
        { status: 400 }
      );
    }

    const accessKey = ACCESS_KEY;
    const appCode = LOVRABET_APP_CODE;

    if (!accessKey) {
      return NextResponse.json(
        { error: 'ACCESS_KEY not configured' },
        { status: 500 }
      );
    }

    // 使用 Next.js 专用的 token 生成函数
    const result = await generateOpenApiTokenForNextjs({
      appCode,
      datasetCode,
      accessKey
    });

    // 返回 token 数据
    return NextResponse.json(result);

  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}