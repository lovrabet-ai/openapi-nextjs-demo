"use client";

import { Table, Tag, Badge } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UpdateButton } from "./SupplierFormButtons";
import { SUPPLIER_FIELDS } from "./types";

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
  const columns: ColumnsType<Record<string, unknown>> = [
    ...serverColumns.map((col) => {
      const fieldMeta = SUPPLIER_FIELDS[col.dataIndex];

      return {
        title: col.title,
        dataIndex: col.dataIndex,
        key: col.dataIndex,
        render: (value: unknown) => {
          // Switch 类型字段 - 显示为徽章
          // TINYINT(1): 0=未删除/正常, 1=已删除
          if (fieldMeta?.type === "switch") {
            const isDeleted = value == 1;
            return (
              <Badge
                status={isDeleted ? "error" : "success"}
                text={isDeleted ? "已删除" : "正常"}
              />
            );
          }

          // Radio 类型字段 - 显示为标签
          if (fieldMeta?.type === "radio" && fieldMeta.options) {
            const option = fieldMeta.options.find((opt) => opt.value === value);
            if (option) {
              // 根据字段类型选择不同的颜色
              let color = "blue";
              if (col.dataIndex === "status") {
                color = value === "active" ? "green" : "red";
              } else if (col.dataIndex === "type") {
                const colors = ["blue", "purple", "orange", "cyan"];
                const index = fieldMeta.options.indexOf(option);
                color = colors[index % colors.length];
              }
              return <Tag color={color}>{option.label}</Tag>;
            }
          }

          // 日期时间字段处理
          if (
            col.dataIndex.includes("time") ||
            col.dataIndex.includes("_at") ||
            col.dataIndex.includes("date")
          ) {
            if (value) {
              return new Date(String(value)).toLocaleString("zh-CN");
            }
          }

          // 默认渲染
          return value !== null && value !== undefined ? String(value) : "-";
        },
        width: 150, // 默认宽度
      };
    }),
    // 添加操作列
    {
      title: "操作",
      key: "action",
      fixed: "right" as const,
      width: 100,
      render: (_: unknown, record: Record<string, unknown>) => (
        <UpdateButton record={record} columns={serverColumns} />
      ),
    },
  ];

  return (
    <div>
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
