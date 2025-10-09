# Next.js + Lovrabet SDK 演示项目

🚀 一个展示如何在 Next.js 15 中集成 Lovrabet SDK 的完整示例项目，包含三种不同的 OpenAPI 调用模式，使用 Ant Design 构建专业的用户界面。

## 📋 目录

- [项目特性](#项目特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [三种集成模式](#三种集成模式)
- [API 路由](#api-路由)
- [UI 组件](#ui-组件)
- [环境配置](#环境配置)
- [开发指南](#开发指南)
- [部署](#部署)

## 🌟 项目特性

- **三种集成模式**：SSR、浏览器直连、API 中转，满足不同场景需求
- **统一导航系统**：左侧固定导航栏，支持快速切换不同场景
- **Ant Design 集成**：使用 AntD Table 组件，提供专业的数据展示
- **动态表格配置**：基于 API 返回的 `tableColumns` 自动配置表格列
- **TypeScript 支持**：完整的类型定义，提供更好的开发体验
- **响应式设计**：适配不同屏幕尺寸，提供良好的用户体验
- **中文界面**：完整的中文支持，包括 AntD 组件的中文配置

## 🛠 技术栈

- **框架**: Next.js 15.5.4 (App Router)
- **语言**: TypeScript 5
- **UI 库**: Ant Design 5.27.4
- **样式**: Tailwind CSS 4
- **SDK**: @lovrabet/sdk (本地开发版)
- **运行时**: React 19.1.0
- **包管理**: npm

## 📁 项目结构

```
nextjs-demo/
├── app/                          # Next.js App Router 目录
│   ├── components/               # 共享组件
│   │   ├── ScenarioLayout.tsx   # 统一布局组件（含导航）
│   │   └── ScenarioNav.tsx      # 左侧导航组件
│   │
│   ├── scenario1-ssr/            # 场景1：服务端渲染
│   │   ├── page.tsx              # 页面组件（服务端组件）
│   │   ├── UserTable.tsx         # AntD 表格组件（客户端组件）
│   │   └── providers.tsx         # AntD ConfigProvider 配置
│   │
│   ├── scenario2-browser/        # 场景2：浏览器直连
│   │   ├── page.tsx              # 页面组件（客户端组件）
│   │   ├── CharacterTable.tsx    # AntD 表格组件
│   │   └── providers.tsx         # AntD ConfigProvider 配置
│   │
│   ├── scenario3-proxy/          # 场景3：API 中转
│   │   ├── page.tsx              # 页面组件（客户端组件）
│   │   ├── DataTable.tsx         # 通用 AntD 表格组件
│   │   └── providers.tsx         # AntD ConfigProvider 配置
│   │
│   ├── api/                      # API 路由
│   │   ├── token/                # Token 生成接口
│   │   │   └── route.ts
│   │   ├── proxy/                # 代理接口
│   │   │   ├── data/
│   │   │   │   └── route.ts      # 通用数据代理
│   │   │   ├── plans/
│   │   │   │   └── route.ts      # 计划管理（示例）
│   │   │   └── orders/
│   │   │       └── route.ts      # 订单管理（示例）
│   │   ├── users/                # 用户数据接口
│   │   │   └── route.ts
│   │   └── characters/           # 汉字数据接口
│   │       └── route.ts
│   │
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 首页
│
├── lib/                          # 工具库
│   ├── sdk-client.ts             # SDK 客户端封装
│   └── sdk-daily-config.ts       # SDK 配置（CLI 自动生成）
│
├── public/                       # 静态资源
├── .env.local                    # 环境变量（需创建）
├── next.config.ts                # Next.js 配置
├── tailwind.config.ts            # Tailwind 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 项目依赖
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd nextjs-demo
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件并配置：

```env
# Lovrabet SDK 配置
ACCESS_KEY=ak-xIXmgi99gwTqa4cwMXwe2wba_gN40dcuBvzFpDRbo_w
SECRET_KEY=sk-your-secret-key-here  # 可选，用于生成 token
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看项目。

### 5. 其他启动选项

```bash
# 使用自定义域名启动（需配置 hosts）
npm run dev:lovrabet  # https://dev.lovrabet.com
npm run dev:popotang  # https://dev.popotang.com

# 生产构建
npm run build
npm run start
```

## 🎯 三种集成模式

### 场景1：服务端渲染 (SSR)

**路径**: `/scenario1-ssr`

**特点**:
- ✅ 数据在服务端获取，渲染成 HTML 后返回
- ✅ 使用 accessKey 认证，密钥不暴露给客户端
- ✅ SEO 友好，首屏加载快
- ✅ 适合公开内容展示
- ✅ 使用 AntD Table 展示数据

**实现要点**:
```typescript
// 服务端组件
async function fetchUsersInfo() {
  "use server";
  const client = createServerClient();
  const model = client.getModel(1);
  const response = await model.getList();
  return {
    data: response.tableData,
    columns: response.tableColumns,
    total: response.paging.totalCount
  };
}
```

**UI 特性**:
- 使用 AntD Table 组件
- 支持动态列配置
- 自动格式化日期、标签等特殊字段
- 集成分页功能

### 场景2：浏览器直连

**路径**: `/scenario2-browser`

**特点**:
- ✅ 浏览器端通过 token 直接调用 OpenAPI
- ✅ 低延迟，无需后端中转
- ✅ Token 有效期 10 分钟，支持刷新
- ✅ 适合交互密集的应用
- ✅ 实时显示 Token 剩余时间

**实现流程**:
1. 从后端获取 token 和 timestamp
2. 使用 token 创建客户端
3. 直接调用 OpenAPI
4. 使用 AntD Table 展示数据

```typescript
// 客户端组件
const fetchToken = async () => {
  const response = await fetch("/api/token", {
    method: "POST",
    body: JSON.stringify({ datasetCode })
  });
  const { token, timestamp } = await response.json();
  const client = createBrowserClient(token, timestamp);
};
```

**UI 特性**:
- Token 状态实时显示
- 剩余时间倒计时
- 即将过期警告提示
- CharacterTable 组件支持汉字数据特殊渲染

### 场景3：API 中转

**路径**: `/scenario3-proxy`

**特点**:
- ✅ 通过 Next.js API Routes 中转
- ✅ 可添加额外的业务逻辑
- ✅ 支持权限控制、数据验证
- ✅ 隐藏 OpenAPI 实现细节
- ✅ 支持分页回调

**架构**:
```
浏览器 → Next.js API Route → OpenAPI → 返回处理后的数据
```

**UI 特性**:
- DataTable 通用组件
- 支持进度条展示
- 状态标签彩色显示
- 分页变化自动请求数据

## 🎨 UI 组件

### ScenarioLayout 统一布局
- 左侧固定导航栏（256px）
- 右侧内容区域自适应
- 集成 AntD ConfigProvider
- 中文语言配置

### Table 组件特性
所有场景的表格组件都支持：
- 动态列配置（基于 `tableColumns`）
- 分页功能（支持快速跳转）
- 响应式横向滚动
- 特殊字段自定义渲染
- Loading 状态
- 中文界面

### 导航系统
- 使用 AntD Menu 组件
- 图标化菜单项
- 当前路径高亮
- 快速场景切换

## 🔌 API 路由

### POST /api/token
生成访问 token，供浏览器端使用。

**请求体**:
```json
{
  "datasetCode": "dataset-code-here"
}
```

**响应**:
```json
{
  "token": "generated-token",
  "timestamp": 1234567890,
  "expiresAt": 1234567890
}
```

### GET /api/proxy/data
代理调用 OpenAPI，返回处理后的数据（使用第0个数据集）。

**查询参数**:
- `page`: 页码（默认 1）
- `size`: 每页大小（默认 10）

**响应**:
```json
{
  "success": true,
  "data": {
    "tableData": [...],
    "tableColumns": [
      {
        "title": "列标题",
        "dataIndex": "字段名"
      }
    ],
    "paging": {
      "currentPage": 1,
      "pageSize": 10,
      "totalCount": 100
    }
  }
}
```

## ⚙️ 环境配置

### SDK 配置文件

`lib/sdk-daily-config.ts` 由 Lovrabet CLI 自动生成，包含：

```typescript
export const LOVRABET_APP_CODE = "app-64289c49";
export const LOVRABET_MODELS_CONFIG = {
  appCode: LOVRABET_APP_CODE,
  models: {
    // 8个数据模型配置
    Product: { tableName: "product", datasetCode: "..." },
    Customer: { tableName: "customer", datasetCode: "..." },
    // ...
  }
};
```

### 客户端创建方式

```typescript
// 服务端客户端（使用 accessKey）
createServerClient()

// 浏览器客户端（使用 token）
createBrowserClient(token, timestamp)

// 代理客户端（无需认证）
createProxyClient()
```

## 💻 开发指南

### 添加新的场景

1. 在 `app/` 下创建新目录
2. 创建页面组件 `page.tsx`
3. 创建表格组件（继承 AntD Table）
4. 使用 `ScenarioLayout` 包裹页面
5. 在 `ScenarioNav` 中添加导航项

### 自定义表格列渲染

```typescript
const columns = serverColumns.map(col => ({
  title: col.title,
  dataIndex: col.dataIndex,
  key: col.dataIndex,
  render: (value: unknown) => {
    // 特殊字段处理
    if (col.dataIndex === 'status') {
      return <Tag color="blue">{value}</Tag>;
    }
    if (col.dataIndex.includes('_at')) {
      return new Date(value).toLocaleDateString('zh-CN');
    }
    return value ?? '-';
  }
}));
```

### 使用不同的数据集

```typescript
// 使用索引选择数据集
const model = client.getModel(0);  // 第一个数据集
const model = client.getModel(1);  // 第二个数据集

// 或使用模型名称
const model = client.models.Product;
const model = client.models.Customer;
```

## 📦 构建与部署

### 本地构建

```bash
npm run build
npm run start
```

### 部署到 Vercel

```bash
vercel deploy
```

### 环境变量配置

在部署平台配置：
- `ACCESS_KEY` - Lovrabet 访问密钥
- `SECRET_KEY` - 密钥（可选）

## 🔧 常见问题

### Q: 如何切换数据集？
A: 修改 `getModel(index)` 中的索引，或使用具体的模型名称。

### Q: Token 过期如何处理？
A: 场景2 中实现了自动刷新机制，显示剩余时间并提供刷新按钮。

### Q: 如何修改表格分页大小？
A: Table 组件支持 `pageSizeOptions`，可自定义分页选项。

### Q: 导航栏如何自定义？
A: 修改 `components/ScenarioNav.tsx`，添加新的菜单项。

### Q: 如何添加新的 API 路由？
A: 在 `app/api/` 下创建新路由，遵循 Next.js App Router 规范。

## 🚨 注意事项

1. **安全性**:
   - `ACCESS_KEY` 仅在服务端使用
   - 不要在客户端代码中暴露密钥
   - 生产环境使用 HTTPS

2. **性能优化**:
   - SSR 适合 SEO 需求
   - 浏览器直连适合交互密集
   - API 中转适合复杂业务逻辑

3. **错误处理**:
   - 所有场景都包含基本错误处理
   - 生产环境需添加日志记录

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**版本信息**:
- Next.js: 15.5.4
- Ant Design: 5.27.4
- React: 19.1.0
- TypeScript: 5.x

**更新日期**: 2025-10-09