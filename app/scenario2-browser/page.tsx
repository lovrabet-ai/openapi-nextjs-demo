"use client";

/**
 * 场景2：浏览器端使用 token 直接调用 OpenAPI
 *
 * 使用真实数据集：CharacterDetails (汉字详情表)
 * 1. 先从后端获取 token 和 timestamp
 * 2. 使用 token 在浏览器端直接调用 OpenAPI
 * 3. 无需后端中转，减少延迟
 */

import { useState, useEffect } from "react";
import { createBrowserClient } from "@/lib/sdk-client";
import type { LovrabetClient } from "@lovrabet/sdk";
import { LOVRABET_MODELS_CONFIG } from "@/lib/sdk-client";
import CharacterTable from "./CharacterTable";
import ScenarioLayout from "../components/ScenarioLayout";

interface TokenData {
  token: string;
  timestamp: number;
  expiresAt: number;
}

interface TableColumn {
  title: string;
  dataIndex: string;
}

// API 响应数据结构
interface ApiResponse {
  paging: {
    pageSize: number;
    totalCount: number;
    currentPage: number;
  };
  tableData: Record<string, unknown>[];
  tableColumns: TableColumn[];
}

export default function Scenario2BrowserPage() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [client, setClient] = useState<LovrabetClient | null>(null);
  const [characters, setCharacters] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取 token
  const fetchToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetCode: Object.entries(LOVRABET_MODELS_CONFIG.models)[0][1]
            .datasetCode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get token: ${response.statusText}`);
      }

      const data = await response.json();
      setTokenData(data);

      // 创建客户端
      const sdkClient = createBrowserClient(data.token, data.timestamp);
      setClient(sdkClient);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get token");
    } finally {
      setLoading(false);
    }
  };

  // 获取汉字数据
  const fetchCharacters = async () => {
    if (!client) {
      setError("Client not initialized");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = (await client.getModel(0).getList()) as ApiResponse;

      setCharacters(response?.tableData || []);
      setColumns(response?.tableColumns || []);
      setTotal(response?.paging?.totalCount || 0);
      setCurrentPage(response?.paging?.currentPage || 1);
      setPageSize(response?.paging?.pageSize || 10);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch characters"
      );
    } finally {
      setLoading(false);
    }
  };

  // Token 剩余时间
  const getRemainingTime = () => {
    if (!tokenData) return 0;
    const remaining = tokenData.expiresAt - Date.now();
    return Math.max(0, Math.floor(remaining / 1000)); // 转换为秒
  };

  // 定时更新剩余时间显示
  const [remainingTime, setRemainingTime] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(getRemainingTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [tokenData]);

  // Token 即将过期警告
  const isExpiring = remainingTime < 60; // 少于60秒认为即将过期

  return (
    <ScenarioLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">场景2：浏览器端直接调用</h1>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-green-900 mb-2">工作原理</h2>
        <ul className="list-disc list-inside text-green-800 space-y-1">
          <li>从后端 API 获取 token 和 timestamp 配对</li>
          <li>在浏览器端使用 SDK 创建客户端</li>
          <li>直接调用 OpenAPI 获取 CharacterDetails 数据</li>
          <li>数据集：f3847284577c4ed6a356f4c9fe4d945a</li>
          <li>Token 有 10 分钟有效期，需要定期刷新</li>
        </ul>
      </div>

      {/* Token 状态 */}
      <div className="mb-6">
        {!tokenData ? (
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-gray-600 mb-4">尚未获取 Token</p>
            <button
              onClick={fetchToken}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "获取中..." : "获取 Token"}
            </button>
          </div>
        ) : (
          <div
            className={`rounded-lg p-4 ${
              isExpiring
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3
                  className={`font-semibold ${
                    isExpiring ? "text-yellow-900" : "text-blue-900"
                  }`}
                >
                  Token 状态
                </h3>
                <p
                  className={`text-sm ${
                    isExpiring ? "text-yellow-700" : "text-blue-700"
                  } mt-1`}
                >
                  剩余有效时间：{Math.floor(remainingTime / 60)}分
                  {remainingTime % 60}秒{isExpiring && " (即将过期！)"}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Token: {tokenData.token}
                </p>
                <p className="text-xs text-gray-600">
                  Timestamp: {tokenData.timestamp}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={fetchToken}
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white ${
                    isExpiring
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } disabled:bg-gray-400`}
                >
                  {loading ? "刷新中..." : "刷新 Token"}
                </button>
                <button
                  onClick={fetchCharacters}
                  disabled={loading || !client}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  {loading ? "加载中..." : "获取汉字数据"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-900">错误</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

        {/* 汉字列表 */}
        {(characters.length > 0 || columns.length > 0) && (
          <CharacterTable
            data={characters}
            columns={columns}
            total={total}
            currentPage={currentPage}
            pageSize={pageSize}
            loading={loading}
          />
        )}
      </div>
    </ScenarioLayout>
  );
}
