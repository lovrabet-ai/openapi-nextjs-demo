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
  columns,
  total,
  currentPage,
  pageSize,
  loading = false,
}: CharacterTableProps) {
  return (
    <div className="antd-table-container">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">总记录数：{total}</span>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => String(record.id || Math.random())}
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
