# Scenario 1: 服务端渲染 (SSR) - Suppliers 数据集 CRUD 演示

## 功能说明

这个演示展示了如何在 Next.js 服务端渲染场景中使用 Lovrabet OpenAPI 对 **Suppliers（供应商）** 数据集进行完整 CRUD 操作：

- ✅ **查询 (Read)** - 服务端获取 Suppliers 列表，SSR 渲染
- ✅ **新增 (Create)** - 使用 Server Actions 创建新供应商记录
- ✅ **更新 (Update)** - 使用 Server Actions 更新现有供应商记录

## 技术架构

### 认证方式
- **OpenAPI AccessKey 模式**
- 密钥只在服务端使用，不暴露给客户端
- 所有操作通过 Server Actions 在服务端执行

### UI 框架
- **Ant Design 5.x** - 完整使用 Ant Design 组件系统
- **CSS-in-JS** - 通过 `@ant-design/cssinjs` 实现 SSR 样式注入
- **无 Tailwind CSS** - 项目已完全迁移到 Ant Design

### 核心文件

```
app/scenario1-ssr/
├── page.tsx                  # 服务端页面组件（SSR 数据获取）
├── PageContent.tsx           # 客户端页面内容（Ant Design UI）
├── actions.ts                # Server Actions（create & update）
├── types.ts                  # TypeScript 类型定义（Supplier 接口、字段元数据）
├── SupplierFormButtons.tsx   # 供应商表单按钮组件（新增/编辑）
└── UserTable.tsx             # 数据表格组件（Ant Design Table）
```

## 数据模型

### Supplier 类型定义（types.ts）

```typescript
export interface Supplier {
  id: number;
  name: string;              // 供应商名称
  type: "MANUFACTURER" | "DISTRIBUTOR" | "WHOLESALER";  // 供应商类型
  status: "PENDING" | "ACTIVE" | "SUSPENDED";           // 状态
  contact_person?: string;   // 联系人
  phone?: string;            // 电话
  email?: string;            // 邮箱
  address?: string;          // 地址
  is_deleted: number;        // 逻辑删除标记（0=正常, 1=已删除）
  created_at: string;
  updated_at: string;
}

// 字段元数据配置 - 用于动态生成表单控件
export const SUPPLIER_FIELDS: Record<string, FieldMeta> = {
  type: {
    type: "radio",
    options: [
      { label: "制造商", value: "MANUFACTURER" },
      { label: "分销商", value: "DISTRIBUTOR" },
      { label: "批发商", value: "WHOLESALER" },
    ],
  },
  status: {
    type: "radio",
    options: [
      { label: "待审核", value: "PENDING" },
      { label: "启用", value: "ACTIVE" },
      { label: "暂停", value: "SUSPENDED" },
    ],
  },
  // ... 其他字段配置
};

// 系统字段 - 编辑时自动过滤
export const SYSTEM_FIELDS = ["id", "created_at", "updated_at", "is_deleted"];
```

## 工作流程

### 1. 查询数据 (SSR)

```typescript
// page.tsx
async function fetchSuppliersInfo() {
  "use server";
  const client = createServerClient(); // 使用 accessKey
  const model = client.getModel("Suppliers"); // 使用特定数据集
  const response = await model.getList() as unknown as ApiResponse<Supplier>["data"];

  return {
    success: true,
    data: response?.tableData || [],
    columns: response?.tableColumns || [],
    total: response?.paging?.totalCount || 0,
  };
}
```

### 2. 创建记录 (Server Action)

```typescript
// actions.ts
export async function createRecord(formData: FormData) {
  "use server";
  const client = createServerClient();
  const model = client.getModel("Suppliers"); // 使用 Suppliers 模型

  const data: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (key === "is_deleted") {
      data[key] = Number(value); // TINYINT(1) 类型
    } else {
      data[key] = value;
    }
  });

  const result = await model.create(data);
  revalidatePath("/scenario1-ssr"); // 刷新页面
  return { success: true, data: result };
}
```

### 3. 更新记录 (Server Action)

```typescript
// actions.ts
export async function updateRecord(id: string | number, formData: FormData) {
  "use server";
  const client = createServerClient();
  const model = client.getModel("Suppliers");

  const data: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (key === "is_deleted") {
      data[key] = Number(value); // 转换为数字
    } else {
      data[key] = value;
    }
  });

  const result = await model.update(id, data);
  revalidatePath("/scenario1-ssr"); // 刷新页面
  return { success: true, data: result };
}
```

### 4. 客户端交互 (Client Component)

#### 动态表单生成（SupplierFormButtons.tsx）

基于 `types.ts` 中的字段元数据，表单控件自动生成：

```typescript
// SupplierFormButtons.tsx
const renderFormItem = (col: TableColumn) => {
  const fieldMeta = SUPPLIER_FIELDS[col.dataIndex];

  switch (fieldMeta?.type) {
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

export function CreateButton({ columns }: SupplierFormButtonsProps) {
  const handleCreate = async () => {
    const values = await form.validateFields();
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === "is_deleted") {
        formData.append(key, value ? "1" : "0"); // Switch -> TINYINT
      } else if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    const result = await createRecord(formData); // 调用 Server Action
  };

  // 自动过滤系统字段
  const businessColumns = columns.filter(
    (col) => !SYSTEM_FIELDS.includes(col.dataIndex)
  );

  return (
    <Modal title="新增记录" open={open} onOk={handleCreate}>
      <Form form={form} layout="vertical">
        {businessColumns.map((col) => (
          <Form.Item key={col.dataIndex} name={col.dataIndex} label={col.title}>
            {renderFormItem(col)}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}
```

#### 关键特性

1. **字段元数据驱动** - 根据 `SUPPLIER_FIELDS` 配置自动渲染不同控件
   - `type: "radio"` → Radio.Group（供应商类型、状态）
   - `type: "switch"` → Switch（is_deleted）
   - `type: "text"` → Input（名称、联系人等）

2. **系统字段保护** - `SYSTEM_FIELDS` 中的字段在编辑时自动隐藏
   - `id`, `created_at`, `updated_at` 不可编辑
   - `is_deleted` 不显示在表单中（系统保护）

3. **类型转换** - FormData 提交前自动转换
   - Switch (boolean) → TINYINT (0/1)
   - 空值过滤（不提交 undefined/null/空字符串）

## 使用说明

### 1. 配置环境变量

确保在 `.env.local` 中配置了：

```bash
NEXT_PUBLIC_APP_CODE=app-d31cb8fb
ACCESS_KEY=ak-_7jQfu0QyEsd3erpcZ45gLmxm9vM_OdfuCt7dy_u6lM
NEXT_PUBLIC_API_ENV=online
```

**环境变量说明：**
- `NEXT_PUBLIC_APP_CODE` - 应用代码（客户端可见）
- `ACCESS_KEY` - 访问密钥（**仅服务端使用，不要加 NEXT_PUBLIC_ 前缀！**）
- `NEXT_PUBLIC_API_ENV` - API 环境（online/daily）

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问页面

打开浏览器访问：`http://localhost:3000/scenario1-ssr`

### 4. 测试功能

1. **查看供应商列表** - 页面加载时自动 SSR 获取 Suppliers 数据
2. **新增供应商** - 点击"新增记录"按钮
   - 填写供应商名称（必填）
   - 选择供应商类型：制造商/分销商/批发商
   - 选择状态：待审核/启用/暂停
   - 填写联系人、电话、邮箱、地址（可选）
3. **编辑供应商** - 点击表格中的"编辑"按钮
   - 修改供应商信息
   - 系统字段（id、创建时间、更新时间、is_deleted）自动隐藏
4. **自动刷新** - 创建/更新成功后，通过 `revalidatePath` 自动刷新 SSR 数据

### 5. 查看调试日志 🆕

本演示已启用 SDK 调试模式，在终端中可以看到详细的 HTTP 请求信息：

```
🔵 [Lovrabet SDK] HTTP POST Request:
📍 URL: https://runtime-daily.lovrabet.com/openapi/data/create
📋 Headers: {
  "Content-Type": "application/json",
  "X-Time-Stamp": "1758903130713",
  "X-App-Code": "app-c2dd52a2",
  "X-Dataset-Code": "...",
  "X-Token": "..."
}
📦 Body: {
  "appCode": "app-c2dd52a2",
  "datasetCode": "...",
  "paramMap": {
    // 业务数据
  }
}
```

**调试日志配置** (`lib/sdk-client.ts`)：

```typescript
return createClient({
  // ...
  options: {
    debug: true, // 启用调试日志
  },
});
```

**如何关闭调试日志：**

将 `debug: true` 改为 `debug: false`，或根据环境变量控制：

```typescript
options: {
  debug: process.env.NODE_ENV === 'development',
}
```

## 安全说明

✅ **安全设计**
- AccessKey 只在服务端使用，通过 `createServerClient()` 创建客户端
- 所有 CRUD 操作都在服务端执行（Server Actions）
- 客户端（浏览器）无法访问 AccessKey

❌ **不要这样做**
```typescript
// ❌ 错误：在客户端使用 accessKey
"use client";
const client = createClient({ accessKey: "..." }); // 会暴露密钥！
```

✅ **正确做法**
```typescript
// ✅ 正确：使用 Server Actions
"use server";
const client = createServerClient(); // 安全
```

## SDK 版本

本项目使用 npm 发布的正式版本：

```json
{
  "dependencies": {
    "@lovrabet/sdk": "^1.1.14",
    "antd": "^5.27.4",
    "next": "15.5.4",
    "react": "^18.3.1"
  }
}
```

**注意事项：**
- 已移除 Tailwind CSS 依赖，完全使用 Ant Design
- 使用 Ant Design v5 的 CSS-in-JS 方案
- React 18.3.1 与 Next.js 15.5.4 完全兼容

## Ant Design SSR 配置

为了避免 FOUC（Flash of Unstyled Content），项目使用了 `@ant-design/cssinjs` 进行 SSR 样式注入：

### AntdRegistry 组件（app/AntdRegistry.tsx）

```typescript
"use client";

import { useServerInsertedHTML } from "next/navigation";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";

export default function AntdRegistry({ children }: { children: React.ReactNode }) {
  const cache = React.useMemo(() => createCache(), []);
  const isServerInserted = React.useRef(false);

  useServerInsertedHTML(() => {
    if (isServerInserted.current) return;
    isServerInserted.current = true;

    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}
```

### 在 Root Layout 中使用

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
```

**关键点：**
- 使用 `useServerInsertedHTML` 在 SSR 时注入样式
- 使用 `StyleProvider` 包裹所有内容
- 避免重复插入样式（`isServerInserted` 标记）

## 相关文档

- [Lovrabet SDK 文档](https://docs.lovrabet.com)
- [OpenAPI 参考](https://docs.lovrabet.com/openapi/reference)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Ant Design with Next.js](https://ant.design/docs/react/use-with-next)
