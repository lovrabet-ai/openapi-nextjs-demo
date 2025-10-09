# Next.js 15 + Lovrabet SDK 演示项目

这是一个展示如何在 Next.js 15 中集成 Lovrabet SDK 的演示项目，包含三种不同的使用场景。

## 🚀 快速开始

### 1. 配置环境变量

创建 `.env.local` 文件：

```bash
# OpenAPI 配置
NEXT_PUBLIC_APP_CODE=app-c4055413

# 后端使用的密钥（不要暴露给前端）
ACCESS_KEY=ak-your-access-key-here
SECRET_KEY=sk-your-secret-key-here

# API 环境
NEXT_PUBLIC_API_ENV=daily
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看演示。

## 📱 三种集成场景

### 场景1：服务端渲染（SSR）
- **路径**: `/scenario1-ssr`
- **文件**: `app/scenario1-ssr/page.tsx`
- **特点**:
  - 在 Next.js 服务端使用 accessKey 认证
  - 数据在服务端获取并渲染
  - 最安全，密钥不暴露给客户端
  - SEO 友好，首屏加载快

### 场景2：浏览器直连
- **路径**: `/scenario2-browser`
- **文件**: `app/scenario2-browser/page.tsx`
- **特点**:
  - 从后端 API 获取 token/timestamp 配对
  - 浏览器端直接调用 OpenAPI
  - 低延迟，减轻服务器压力
  - Token 有 10 分钟有效期

### 场景3：API 中转
- **路径**: `/scenario3-proxy`
- **文件**: `app/scenario3-proxy/page.tsx`
- **API**: `app/api/proxy/orders/route.ts`
- **特点**:
  - 通过 Next.js API Routes 中转请求
  - 可添加额外的业务逻辑和权限控制
  - 隐藏 OpenAPI 实现细节

## 🔧 模型配置

在 `lib/sdk-config.ts` 中配置你的数据模型：

```typescript
const modelsConfig = {
  Users: {
    tableName: 'users',
    datasetCode: 'user-dataset-001'
  },
  Orders: {
    tableName: 'orders',
    datasetCode: 'order-dataset-002'
  },
  // ... 更多模型
};
```

## 🛠 项目结构

```
nextjs-demo/
├── app/
│   ├── scenario1-ssr/       # 场景1：服务端渲染
│   │   └── page.tsx
│   ├── scenario2-browser/   # 场景2：浏览器直连
│   │   └── page.tsx
│   ├── scenario3-proxy/     # 场景3：API 中转
│   │   └── page.tsx
│   ├── api/
│   │   ├── token/           # Token 生成 API
│   │   │   └── route.ts
│   │   └── proxy/           # 代理 API
│   │       └── orders/
│   │           ├── route.ts
│   │           └── [id]/
│   │               └── route.ts
│   └── page.tsx             # 首页
├── lib/
│   ├── sdk-config.ts        # SDK 模型配置
│   └── sdk-client.ts        # SDK 客户端工具
├── .env.local               # 环境变量（需自行创建）
└── package.json
```

## 📝 注意事项

1. **安全性**:
   - `ACCESS_KEY` 和 `SECRET_KEY` 仅在服务端使用
   - 永远不要在客户端代码中硬编码这些密钥
   - 使用 HTTPS 传输 token

2. **Token 管理**:
   - Token 有效期为 10 分钟
   - 建议在过期前 1 分钟刷新
   - Token 和 timestamp 必须配对使用

3. **错误处理**:
   - 所有场景都包含了基本的错误处理
   - 生产环境需要更完善的错误处理和日志

4. **性能优化**:
   - 场景1 适合需要 SEO 的页面
   - 场景2 适合交互频繁的应用
   - 场景3 适合需要复杂业务逻辑的场景

## 📦 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 🔗 相关链接

- [Lovrabet SDK 文档](../lovrabet-node-sdk/README.md)
- [Next.js 文档](https://nextjs.org/docs)
- [OpenAPI 文档](../help/docs/openapi/intro.md)