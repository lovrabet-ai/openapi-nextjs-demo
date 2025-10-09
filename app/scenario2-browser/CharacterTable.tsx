"use client";

import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface TableColumn {
  title: string;
  dataIndex: string;
}

interface CharacterTableProps {
  data: Record<string, unknown>[];
  columns: TableColumn[];
  total: number;
  currentPage: number;
  pageSize: number;
  loading?: boolean;
}

export default function CharacterTable({
  data,
  columns: serverColumns,
  total,
  currentPage,
  pageSize,
  loading = false,
}: CharacterTableProps) {
  // 将服务端返回的列配置转换为 AntD Table 的列配置
  const columns: ColumnsType<Record<string, unknown>> = serverColumns.map(
    (col) => ({
      title: col.title,
      dataIndex: col.dataIndex,
      key: col.dataIndex,
      render: (value: unknown) => {
        // 特殊处理某些字段的渲染

        // 汉字字段 - 放大显示
        if (col.dataIndex === "char" || col.dataIndex === "character") {
          return (
            <span className="text-2xl font-bold">
              {value !== null && value !== undefined ? String(value) : "-"}
            </span>
          );
        }

        // 笔画数 - 使用标签
        if (col.dataIndex === "bihua" || col.dataIndex === "strokes") {
          return value ? (
            <Tag color="blue">{String(value)} 画</Tag>
          ) : (
            "-"
          );
        }

        // 拼音 - 特殊格式
        if (col.dataIndex === "pinyin") {
          return value ? (
            <span className="text-base">{String(value)}</span>
          ) : (
            "-"
          );
        }

        // 释义 - 可能较长，使用 tooltip
        if (col.dataIndex === "jijie" || col.dataIndex === "meaning" || col.dataIndex === "xiangjie") {
          const text = value !== null && value !== undefined ? String(value) : "-";
          return (
            <div
              className="max-w-xs truncate"
              title={text}
            >
              {text}
            </div>
          );
        }

        // 日期时间字段
        if (col.dataIndex.includes("time") || col.dataIndex.includes("_at")) {
          if (value) {
            return new Date(String(value)).toLocaleDateString("zh-CN");
          }
        }

        // 默认渲染
        return value !== null && value !== undefined ? String(value) : "-";
      },
      width: col.dataIndex === "xiangjie" || col.dataIndex === "meaning" ? 300 : 150,
    })
  );

  return (
    <div className="antd-table-container">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          总记录数：{total}
        </span>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) =>
          String(record.id || Math.random())
        }
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showTotal: (total) => `共 ${total} 条记录`,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        loading={loading}
        bordered
        scroll={{ x: 900 }}
      />
    </div>
  );
}