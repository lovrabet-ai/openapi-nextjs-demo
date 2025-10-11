# Next.js + Lovrabet SDK 演示项目

展示如何在 Next.js 15 中集成 Lovrabet SDK 的完整示例，包含三种 OpenAPI 调用模式。

## 项目简介

本项目演示了 Lovrabet SDK 与 Next.js 的三种集成方式：

- **场景 1：服务端渲染（SSR）** - 使用 Suppliers 数据集，支持 CRUD 操作
- **场景 2：浏览器直连** - Token 认证，直接调用 OpenAPI
- **场景 3：API 中转** - 通过 Next.js API Routes 代理

## 技术栈

- **框架**: Next.js 15.5.4 (App Router)
- **语言**: TypeScript 5
- **UI 库**: Ant Design 5.27.4
- **运行时**: React 18.2.0
- **SDK**: @lovrabet/sdk 1.1.14

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_APP_CODE=app-d31cb8fb
ACCESS_KEY=ak-_7jQfu0QyEsd3erpcZ45gLmxm9vM_OdfuCt7dy_u6lM
NEXT_PUBLIC_API_ENV=online
```

**重要**：`ACCESS_KEY` 仅在服务端使用，不要加 `NEXT_PUBLIC_` 前缀！

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
app/
├── components/              # 共享组件
│   ├── ScenarioLayout.tsx   # 布局（Ant Design Layout）
│   └── ScenarioNav.tsx      # 导航菜单
├── scenario1-ssr/           # 场景1：服务端渲染
│   ├── page.tsx             # 服务端组件（SSR）
│   ├── PageContent.tsx      # 客户端 UI
│   ├── actions.ts           # Server Actions (CRUD)
│   ├── types.ts             # Supplier 类型定义
│   ├── SupplierFormButtons.tsx  # 新增/编辑表单
│   └── UserTable.tsx        # 数据表格
├── scenario2-browser/       # 场景2：浏览器直连
├── scenario3-proxy/         # 场景3：API 中转
├── api/                     # API Routes
│   ├── token/              # Token 生成
│   └── proxy/              # 数据代理
├── AntdRegistry.tsx        # Ant Design SSR 配置
├── layout.tsx              # 根布局
└── page.tsx                # 首页

lib/
├── sdk-client.ts           # SDK 客户端封装
└── sdk-daily-config.ts     # SDK 配置
```

## 三种集成模式

### 场景 1：服务端渲染（/scenario1-ssr）

- ✅ 使用 Suppliers 数据集演示完整 CRUD
- ✅ 基于字段元数据动态生成表单（Radio、Switch、Input）
- ✅ Server Actions 处理数据操作
- ✅ AccessKey 仅在服务端使用，安全可靠
- ✅ SEO 友好，首屏快速加载

**核心代码**：

```typescript
// 服务端获取数据
const client = createServerClient();
const model = client.getModel("Suppliers");
const response = await model.getList();
```

详见 [scenario1-ssr/README.md](app/scenario1-ssr/README.md)

### 场景 2：浏览器直连（/scenario2-browser）

- ✅ Token 认证（10 分钟有效期）
- ✅ 浏览器直接调用 OpenAPI，低延迟
- ✅ 实时显示 Token 剩余时间
- ✅ 支持 Token 刷新

**核心代码**：

```typescript
// 获取 token 后创建客户端
const { token, timestamp } = await fetch("/api/token").then((r) => r.json());
const client = createBrowserClient(token, timestamp);
```

### 场景 3：API 中转（/scenario3-proxy）

- ✅ 通过 Next.js API Routes 中转调用
- ✅ 可添加业务逻辑、权限验证
- ✅ 隐藏 OpenAPI 实现细节
- ✅ 支持数据转换和缓存

**核心代码**：

```typescript
// 前端调用 API Route
const data = await fetch("/api/proxy/data").then((r) => r.json());
```

## Ant Design SSR 配置

项目使用 `@ant-design/cssinjs` 实现 SSR 样式注入，避免 FOUC 问题：

```typescript
// app/AntdRegistry.tsx
import { useServerInsertedHTML } from "next/navigation";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";

export default function AntdRegistry({ children }) {
  const cache = useMemo(() => createCache(), []);

  useServerInsertedHTML(() => (
    <style dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ));

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}
```

## 开发说明

### 构建生产版本

```bash
npm run build
npm run start
```

### 其他启动方式

```bash
npm run dev:lovrabet   # https://dev.lovrabet.com
npm run dev:popotang   # https://dev.popotang.com
```

## 注意事项

1. **安全性**

   - `ACCESS_KEY` 只在服务端使用
   - 不要在客户端暴露密钥
   - 生产环境必须使用 HTTPS

2. **React 版本**

   - 使用 React 18.2.0 以避免 Ant Design 兼容性警告
   - Next.js 15 完全支持 React 18

3. **数据模型**
   - 场景 1 使用 `getModel('Suppliers')` 指定数据集
   - 其他场景使用 `getModel(0)` 使用第一个数据集

## 相关文档

- [Lovrabet SDK 文档](https://docs.lovrabet.com)
- [Next.js 文档](https://nextjs.org/docs)
- [Ant Design 文档](https://ant.design)

## License

MIT
