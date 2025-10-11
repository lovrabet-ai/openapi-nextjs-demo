"use client";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface TableColumn {
  title: string;
  dataIndex: string;
}

interface DataTableProps {
  data: Record<string, unknown>[];
  columns: TableColumn[];
  total: number;
  currentPage: number;
  pageSize: number;
  loading?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
}

export default function DataTable({
  data,
  columns: serverColumns,
  total,
  currentPage,
  pageSize,
  loading = false,
  onPageChange,
}: DataTableProps) {
  // 将服务端返回的列配置转换为 AntD Table 的列配置
  const columns: ColumnsType<Record<string, unknown>> = serverColumns.map(
    (col) => ({
      title: col.title,
      dataIndex: col.dataIndex,
      key: col.dataIndex,
      render: (value: unknown) => {
        // 日期时间字段
        if (
          col.dataIndex.includes("date") ||
          col.dataIndex.includes("_at") ||
          col.dataIndex.includes("time")
        ) {
          if (value) {
            return new Date(String(value)).toLocaleDateString("zh-CN");
          }
        }

        // 布尔值字段
        if (typeof value === "boolean") {
          return value ? "是" : "否";
        }

        // 默认渲染
        return value !== null && value !== undefined ? String(value) : "-";
      },
      width: 150,
    })
  );

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, color: "#666" }}>总记录数：{total}</span>
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
          onChange: onPageChange,
        }}
        loading={loading}
        bordered
        scroll={{ x: 900 }}
      />
    </div>
  );
}