/**
 * Crypto helper for Next.js API routes
 *
 * This is a workaround for the crypto module import issue in Next.js
 * It uses Node.js built-in crypto module directly
 */

import crypto from 'crypto';

// 定义类型（避免从 SDK 导入，防止构建问题）
interface GenerateTokenParams {
  appCode: string;
  datasetCode: string;
  accessKey: string;
  secretKey?: string;
  timestamp?: number;
}

interface TokenResult {
  token: string;
  timestamp: number;
  expiresAt: number;
}

const DEFAULT_SECRET_KEY = 'sk-9Wc0wdYTNdEYXX1nFLcx0zPDU3wVNrSDroByjrgAbU4';
const TOKEN_VALIDITY_MS = 10 * 60 * 1000; // 10分钟

/**
 * 生成 HMAC-SHA256 签名 (Next.js API 专用)
 */
function hmacSha256(data: string, key: string): string {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(data, 'utf8');
  return hmac.digest('base64');
}

/**
 * 生成 OpenAPI Token (Next.js API 专用)
 *
 * 这是 SDK generateOpenApiToken 的直接实现，避免构建后的导入问题
 */
export async function generateOpenApiTokenForNextjs(params: GenerateTokenParams): Promise<TokenResult> {
  const {
    appCode,
    datasetCode,
    accessKey,
    secretKey = DEFAULT_SECRET_KEY,
    timestamp = Date.now()
  } = params;

  // 参数验证
  if (!appCode) throw new Error('appCode is required for token generation');
  if (!datasetCode) throw new Error('datasetCode is required for token generation');
  if (!accessKey) throw new Error('accessKey is required for token generation');

  // 构建签名参数（按字母顺序）
  const signatureParams = {
    accessKey,
    appCode,
    datasetCode,
    timeStamp: timestamp.toString()
  };

  // 按字母顺序排序并构建签名字符串
  const entries = Object.entries(signatureParams).sort(([a], [b]) => a.localeCompare(b));
  const stringToSign = entries.map(([key, value]) => `${key}=${value}`).join('&');

  // 生成 HMAC-SHA256 签名
  const token = hmacSha256(stringToSign, secretKey);

  // 计算过期时间
  const expiresAt = timestamp + TOKEN_VALIDITY_MS;

  return {
    token,
    timestamp,
    expiresAt
  };
}