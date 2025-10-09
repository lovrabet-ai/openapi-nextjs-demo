"use client";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface TableColumn {
  title: string;
  dataIndex: string;
}

interface UserTableProps {
  data: Record<string, unknown>[];
  columns: TableColumn[];
  total: number;
  currentPage: number;
  pageSize: number;
}

export default function UserTable({
  data,
  columns: serverColumns,
  total,
  currentPage,
  pageSize,
}: UserTableProps) {
  // 将服务端返回的列配置转换为 AntD Table 的列配置
  const columns: ColumnsType<Record<string, unknown>> = serverColumns.map(
    (col) => ({
      title: col.title,
      dataIndex: col.dataIndex,
      key: col.dataIndex,
      render: (value: unknown) => {
        // 日期时间字段处理
        if (col.dataIndex.includes("time") || col.dataIndex.includes("_at") || col.dataIndex.includes("date")) {
          if (value) {
            return new Date(String(value)).toLocaleDateString("zh-CN");
          }
        }
        // 默认渲染
        return value !== null && value !== undefined ? String(value) : "-";
      },
      width: 150, // 默认宽度
    })
  );

  return (
    <div className="antd-table-container">
      <div className="mb-4">
        <span className="text-sm text-gray-600">
          总记录数：{total}
        </span>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) =>
          String(record.id || record.user_id || Math.random())
        }
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showTotal: (total) => `共 ${total} 条记录`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        bordered
        scroll={{ x: 900 }}
      />
    </div>
  );
}