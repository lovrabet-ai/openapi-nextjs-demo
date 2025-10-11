"use client";

/**
 * 场景2：浏览器端直接调用
 *
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
import { Button, Alert, Card, Typography, Space } from "antd";

const { Title, Text, Paragraph } = Typography;

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

  // 获取数据
  const fetchCharacters = async () => {
    if (!client) {
      setError("Client not initialized");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = (await client.getModel(0).getList()) as unknown as ApiResponse;

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
      <div style={{ padding: 24 }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Title level={2}>场景2：浏览器端直接调用</Title>

          <Alert
            message="工作原理"
            description={
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>从后端 API 获取 token 和 timestamp 配对</li>
                <li>在浏览器端使用 SDK 创建客户端</li>
                <li>直接调用 OpenAPI 获取数据</li>
                <li>使用第 0 个数据集</li>
                <li>Token 有 10 分钟有效期，需要定期刷新</li>
              </ul>
            }
            type="success"
            showIcon
          />

          {/* Token 状态 */}
          {!tokenData ? (
            <Card>
              <Space direction="vertical" size="middle">
                <Text type="secondary">尚未获取 Token</Text>
                <Button
                  type="primary"
                  onClick={fetchToken}
                  loading={loading}
                >
                  获取 Token
                </Button>
              </Space>
            </Card>
          ) : (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space direction="vertical" size="small" style={{ flex: 1 }}>
                  <Text strong style={{ fontSize: 16 }}>Token 状态</Text>
                  <Text type={isExpiring ? "warning" : "secondary"}>
                    剩余有效时间：{Math.floor(remainingTime / 60)}分
                    {remainingTime % 60}秒{isExpiring && " (即将过期！)"}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Token: {tokenData.token}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Timestamp: {tokenData.timestamp}
                  </Text>
                </Space>
                <Space>
                  <Button
                    type={isExpiring ? "default" : "primary"}
                    onClick={fetchToken}
                    loading={loading}
                    danger={isExpiring}
                  >
                    刷新 Token
                  </Button>
                  <Button
                    type="primary"
                    onClick={fetchCharacters}
                    loading={loading}
                    disabled={!client}
                  >
                    获取数据
                  </Button>
                </Space>
              </div>
            </Card>
          )}

          {/* 错误信息 */}
          {error && (
            <Alert
              message="错误"
              description={error}
              type="error"
              showIcon
            />
          )}

          {/* 数据列表 */}
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
        </Space>
      </div>
    </ScenarioLayout>
  );
}
