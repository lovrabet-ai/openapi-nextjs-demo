"use client";

import { Table, Tag, Progress } from "antd";
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
      render: (value: unknown, record: Record<string, unknown>) => {
        // 特殊处理某些字段的渲染

        // 状态字段 - 使用标签
        if (col.dataIndex === "status" && value) {
          const status = String(value);
          let color = "default";
          let text = status;

          switch (status) {
            case "active":
              color = "green";
              text = "进行中";
              break;
            case "paused":
              color = "orange";
              text = "已暂停";
              break;
            case "completed":
              color = "blue";
              text = "已完成";
              break;
            case "cancelled":
              color = "red";
              text = "已取消";
              break;
          }

          return <Tag color={color}>{text}</Tag>;
        }

        // 进度字段 - 使用进度条
        if (col.dataIndex === "completed_chars") {
          const completed = Number(value) || 0;
          const target = Number(record.target_chars) || 1;
          const percent = Math.min(100, Math.round((completed / target) * 100));

          return (
            <div style={{ minWidth: 150 }}>
              <Progress
                percent={percent}
                size="small"
                format={() => `${completed}/${target}`}
              />
            </div>
          );
        }

        // 数值字段带单位
        if (col.dataIndex === "target_chars") {
          return value ? `${value} 字` : "-";
        }

        if (col.dataIndex === "daily_target") {
          return value ? `${value} 字/天` : "-";
        }

        // 日期时间字段
        if (
          col.dataIndex.includes("date") ||
          col.dataIndex.includes("_at")
        ) {
          if (value) {
            return new Date(String(value)).toLocaleDateString("zh-CN");
          }
        }

        // 默认渲染
        return value !== null && value !== undefined ? String(value) : "-";
      },
      width:
        col.dataIndex === "completed_chars"
          ? 180
          : col.dataIndex === "plan_name"
          ? 200
          : 150,
    })
  );

  return (
    <div className="antd-table-container">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">总记录数：{total}</span>
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