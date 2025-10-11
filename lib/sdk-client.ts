import { createClient, CONFIG_NAMES, type Environment } from '@lovrabet/sdk';
import type { LovrabetClient } from '@lovrabet/sdk';
import { LOVRABET_APP_CODE, ACCESS_KEY, LOVRABET_MODELS_CONFIG } from './d31cb8fb-api'; // 确保模型已注册

const ENV = process.env.NEXT_PUBLIC_API_ENV as Environment;

/**
 * 创建服务端客户端（使用 accessKey）
 * 仅在服务端使用
 */
export function createServerClient(): LovrabetClient {
  if (typeof window !== 'undefined') {
    throw new Error('createServerClient can only be used on the server side');
  }

  const accessKey = ACCESS_KEY;

  if (!accessKey) {
    throw new Error('ACCESS_KEY is required in environment variables');
  }

  return createClient({
    apiConfigName: CONFIG_NAMES.DEFAULT,
    appCode: LOVRABET_APP_CODE,
    accessKey: ACCESS_KEY,
    env: ENV,
    options: {
      debug: true, // 启用调试日志
    },
  });
}

/**
 * 创建客户端（使用 token）
 * 可在浏览器端使用
 */
export function createBrowserClient(token: string, timestamp: number): LovrabetClient {
  return createClient({
    apiConfigName: CONFIG_NAMES.DEFAULT,
    appCode: LOVRABET_APP_CODE,
    token,
    timestamp,
    env: ENV
  });
}

/**
 * 创建代理客户端（不需要认证，通过 API 中转）
 * 用于场景3：前端通过后端 API 中转
 */
export function createProxyClient(): LovrabetClient {
  return createClient({
    apiConfigName: CONFIG_NAMES.DEFAULT,
    appCode: LOVRABET_APP_CODE,
    requiresAuth: false, // 不需要认证，因为会通过 API 中转
    env: ENV
  });
}

export { ACCESS_KEY, LOVRABET_APP_CODE, LOVRABET_MODELS_CONFIG };