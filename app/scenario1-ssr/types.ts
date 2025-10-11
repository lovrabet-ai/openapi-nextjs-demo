/**
 * Suppliers 供应商数据类型定义
 * 根据实际数据结构定义
 */

// 供应商类型枚举
export enum SupplierType {
  // 根据实际业务定义
  // 示例值，需要根据实际情况调整
}

// 供应商状态枚举
export enum SupplierStatus {
  // 根据实际业务定义
  // 示例值，需要根据实际情况调整
}

// 供应商数据接口
export interface Supplier {
  id: number; // 主键ID
  name: string; // 供应商名称
  code: string; // 供应商编码
  type: string; // 供应商类型（ENUM）
  status: string; // 状态（ENUM）
  contact_name: string; // 联系人
  contact_phone: string; // 联系电话
  is_deleted: boolean | number; // 是否删除（BIT类型可能返回0/1）
  created_at: string; // 创建时间
  updated_at: string; // 更新时间
}

// 创建供应商时的数据（不包含系统字段）
export interface CreateSupplierData {
  name: string;
  code: string;
  type: string;
  status: string;
  contact_name: string;
  contact_phone: string;
  is_deleted?: boolean | number;
}

// 更新供应商时的数据（所有字段可选）
export interface UpdateSupplierData extends Partial<CreateSupplierData> {}

// 表格列配置
export interface TableColumn {
  title: string;
  dataIndex: string;
}

// API 响应数据结构
export interface ApiResponse<T = Supplier> {
  msg?: string;
  data: {
    paging: {
      pageSize: number;
      totalCount: number;
      currentPage: number;
    };
    tableData: T[];
    tableColumns: TableColumn[];
  };
  success: boolean;
  errorMsg?: string;
  errorCode?: number;
}

// 字段元数据配置
export interface FieldMeta {
  name: string; // 字段名
  label: string; // 显示标签
  type: "text" | "select" | "radio" | "switch"; // 控件类型
  required: boolean; // 是否必填
  options?: Array<{ label: string; value: string | number }>; // 选项（用于select/radio）
  placeholder?: string; // 占位符
  rules?: any[]; // 额外的验证规则
}

// Suppliers 字段配置
export const SUPPLIER_FIELDS: Record<string, FieldMeta> = {
  name: {
    name: "name",
    label: "供应商名称",
    type: "text",
    required: true,
    placeholder: "请输入供应商名称，用于合同签署和业务往来",
  },
  code: {
    name: "code",
    label: "供应商编码",
    type: "text",
    required: true,
    placeholder: "请输入供应商编码，用于系统识别和快速查找",
  },
  type: {
    name: "type",
    label: "供应商类型",
    type: "radio",
    required: true,
    options: [
      { label: "制造商", value: "MANUFACTURER" },
      { label: "分销商", value: "DISTRIBUTOR" },
      { label: "批发商", value: "WHOLESALER" },
    ],
  },
  status: {
    name: "status",
    label: "状态",
    type: "radio",
    required: true,
    options: [
      { label: "待审核", value: "PENDING" },
      { label: "启用", value: "ACTIVE" },
      { label: "暂停", value: "SUSPENDED" },
    ],
  },
  contact_name: {
    name: "contact_name",
    label: "联系人",
    type: "text",
    required: true,
    placeholder: "请输入供应商的主要联系人",
  },
  contact_phone: {
    name: "contact_phone",
    label: "联系电话",
    type: "text",
    required: true,
    placeholder: "请输入联系人的电话号码",
    rules: [
      {
        pattern: /^1[3-9]\d{9}$/,
        message: "请输入有效的手机号码",
      },
    ],
  },
  is_deleted: {
    name: "is_deleted",
    label: "是否删除",
    type: "switch",
    required: false,
    placeholder: "开启表示已删除，关闭表示正常（数据库: 0=正常, 1=已删除）",
  },
};

// 系统字段列表（创建/编辑时应该过滤掉）
// is_deleted 是系统保护字段，不允许通过普通 update 接口修改
export const SYSTEM_FIELDS = ["id", "created_at", "updated_at", "is_deleted"];
