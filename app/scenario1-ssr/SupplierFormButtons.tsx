"use client";

import { useState } from "react";
import { Button, Modal, Form, Input, Radio, Switch, message } from "antd";
import type { Rule } from "antd/es/form";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { createRecord, updateRecord } from "./actions";
import { SUPPLIER_FIELDS, SYSTEM_FIELDS } from "./types";

interface TableColumn {
  title: string;
  dataIndex: string;
}

interface SupplierFormButtonsProps {
  columns: TableColumn[];
}

export function CreateButton({ columns }: SupplierFormButtonsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // 创建 FormData
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        // Switch 类型(is_deleted)：true->1, false->0（包括 false 值）
        if (key === "is_deleted") {
          formData.append(key, value ? "1" : "0");
        } else if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });

      const result = await createRecord(formData);

      if (result.success) {
        message.success("创建成功！");
        form.resetFields();
        setOpen(false);
      } else {
        message.error(`创建失败: ${result.error}`);
      }
    } catch (error) {
      console.error("创建失败:", error);
      message.error("创建失败，请检查表单");
    } finally {
      setLoading(false);
    }
  };

  // 过滤掉系统字段，只显示业务字段
  const businessColumns = columns.filter(
    (col) => !SYSTEM_FIELDS.includes(col.dataIndex)
  );

  // 渲染表单项：根据字段类型返回不同的控件
  const renderFormItem = (col: TableColumn) => {
    const fieldMeta = SUPPLIER_FIELDS[col.dataIndex];

    // 如果没有配置元数据，使用默认的 Input
    if (!fieldMeta) {
      return <Input placeholder={`请输入${col.title}`} />;
    }

    // 根据字段类型渲染不同的控件
    switch (fieldMeta.type) {
      case "radio":
        return (
          <Radio.Group>
            {fieldMeta.options?.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        );

      case "switch":
        return <Switch />;

      case "text":
      default:
        return <Input placeholder={fieldMeta.placeholder || `请输入${col.title}`} />;
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        新增记录
      </Button>

      <Modal
        title="新增记录"
        open={open}
        onOk={handleCreate}
        onCancel={() => setOpen(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          {businessColumns.map((col) => {
            const fieldMeta = SUPPLIER_FIELDS[col.dataIndex];
            const isRequired = fieldMeta?.required ?? true;

            // 对于 Switch 类型，使用 valuePropName
            const formItemProps: {
              label: string;
              name: string;
              rules: Rule[];
              valuePropName?: string;
            } = {
              label: col.title,
              name: col.dataIndex,
              rules: [
                {
                  required: isRequired,
                  message: `请输入${col.title}`,
                },
                ...(fieldMeta?.rules || []),
              ] as Rule[],
            };

            // Switch 类型需要特殊处理
            if (fieldMeta?.type === "switch") {
              formItemProps.valuePropName = "checked";
              formItemProps.rules = []; // Switch 通常不需要必填验证
            }

            return (
              <Form.Item key={col.dataIndex} {...formItemProps}>
                {renderFormItem(col)}
              </Form.Item>
            );
          })}
        </Form>
      </Modal>
    </>
  );
}

interface UpdateButtonProps {
  record: Record<string, unknown>;
  columns: TableColumn[];
}

export function UpdateButton({ record, columns }: UpdateButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // 创建 FormData
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        // Switch 类型(is_deleted)：true->1, false->0（包括 false 值）
        if (key === "is_deleted") {
          formData.append(key, value ? "1" : "0");
        } else if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });

      const recordId = (record.id || record.user_id) as string | number;
      if (!recordId) {
        message.error("记录 ID 不存在");
        return;
      }

      const result = await updateRecord(recordId, formData);

      if (result.success) {
        message.success("更新成功！");
        setOpen(false);
      } else {
        message.error(`更新失败: ${result.error}`);
      }
    } catch (error) {
      console.error("更新失败:", error);
      message.error("更新失败，请检查表单");
    } finally {
      setLoading(false);
    }
  };

  // 过滤掉系统字段
  const businessColumns = columns.filter(
    (col) => !SYSTEM_FIELDS.includes(col.dataIndex)
  );

  // 渲染表单项：根据字段类型返回不同的控件
  const renderFormItem = (col: TableColumn) => {
    const fieldMeta = SUPPLIER_FIELDS[col.dataIndex];

    // 如果没有配置元数据，使用默认的 Input
    if (!fieldMeta) {
      return <Input placeholder={`请输入${col.title}`} />;
    }

    // 根据字段类型渲染不同的控件
    switch (fieldMeta.type) {
      case "radio":
        return (
          <Radio.Group>
            {fieldMeta.options?.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        );

      case "switch":
        return <Switch />;

      case "text":
      default:
        return <Input placeholder={fieldMeta.placeholder || `请输入${col.title}`} />;
    }
  };

  return (
    <>
      <Button
        type="link"
        icon={<EditOutlined />}
        onClick={() => {
          // 设置表单初始值
          const initialValues: Record<string, unknown> = {};
          businessColumns.forEach((col) => {
            const value = record[col.dataIndex];
            // Switch 类型需要转换：0->false, 1->true
            if (col.dataIndex === "is_deleted") {
              initialValues[col.dataIndex] = value === 1 || value === "1" || value === true;
            } else {
              initialValues[col.dataIndex] = value;
            }
          });
          form.setFieldsValue(initialValues);
          setOpen(true);
        }}
        size="small"
      >
        编辑
      </Button>

      <Modal
        title="编辑记录"
        open={open}
        onOk={handleUpdate}
        onCancel={() => setOpen(false)}
        confirmLoading={loading}
        width={600}
      >
        <div style={{ marginBottom: 8, fontSize: 14, color: "#666" }}>
          编辑 ID: {String(record.id || record.user_id)}
        </div>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          {businessColumns.map((col) => {
            const fieldMeta = SUPPLIER_FIELDS[col.dataIndex];
            const isRequired = fieldMeta?.required ?? false; // 编辑时可以不必填

            // 对于 Switch 类型，使用 valuePropName
            const formItemProps: {
              label: string;
              name: string;
              rules: Rule[];
              valuePropName?: string;
            } = {
              label: col.title,
              name: col.dataIndex,
              rules: [
                {
                  required: isRequired,
                  message: `请输入${col.title}`,
                },
                ...(fieldMeta?.rules || []),
              ] as Rule[],
            };

            // Switch 类型需要特殊处理
            if (fieldMeta?.type === "switch") {
              formItemProps.valuePropName = "checked";
              formItemProps.rules = []; // Switch 通常不需要必填验证
            }

            return (
              <Form.Item key={col.dataIndex} {...formItemProps}>
                {renderFormItem(col)}
              </Form.Item>
            );
          })}
        </Form>
      </Modal>
    </>
  );
}
