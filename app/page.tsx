import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        Lovrabet SDK Next.js 15 演示
      </h1>

      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">演示说明</h2>
        <p className="text-gray-700 mb-2">
          这是一个使用 Next.js 15 和 Lovrabet SDK 的演示项目，展示了三种不同的集成模式：
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>App Code: <code className="bg-gray-200 px-1">app-c4055413</code></li>
          <li>环境: <code className="bg-gray-200 px-1">daily</code></li>
          <li>SDK 版本: <code className="bg-gray-200 px-1">@lovrabet/sdk (本地开发版)</code></li>
        </ul>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 场景1 */}
        <Link href="/scenario1-ssr">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">场景1：服务端渲染</h3>
            <p className="text-gray-600 mb-4">
              Next.js 服务端直接使用 accessKey 调用 OpenAPI，数据在服务端渲染
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-blue-600">✓ 最安全（密钥不暴露）</p>
              <p className="text-blue-600">✓ SEO 友好</p>
              <p className="text-blue-600">✓ 首屏加载快</p>
            </div>
          </div>
        </Link>

        {/* 场景2 */}
        <Link href="/scenario2-browser">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">场景2：浏览器直连</h3>
            <p className="text-gray-600 mb-4">
              浏览器获取 token 后直接调用 OpenAPI，无需后端中转
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-green-600">✓ 低延迟（直连）</p>
              <p className="text-green-600">✓ 减轻服务器压力</p>
              <p className="text-green-600">✓ Token 10分钟有效</p>
            </div>
          </div>
        </Link>

        {/* 场景3 */}
        <Link href="/scenario3-proxy">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">场景3：API 中转</h3>
            <p className="text-gray-600 mb-4">
              通过 Next.js API Routes 中转，可添加额外的业务逻辑
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-purple-600">✓ 灵活的权限控制</p>
              <p className="text-purple-600">✓ 数据转换和验证</p>
              <p className="text-purple-600">✓ 隐藏 OpenAPI 细节</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-900 mb-2">配置提醒</h2>
        <p className="text-yellow-700 mb-2">
          请在 <code className="bg-yellow-100 px-1">.env.local</code> 文件中配置以下环境变量：
        </p>
        <pre className="bg-yellow-100 p-3 rounded text-sm overflow-x-auto">
{`ACCESS_KEY=ak-your-access-key-here
SECRET_KEY=sk-your-secret-key-here (可选)`}
        </pre>
        <p className="text-yellow-600 text-sm mt-2">
          注意：ACCESS_KEY 和 SECRET_KEY 仅在服务端使用，永远不要暴露给客户端！
        </p>
      </div>

      <div className="mt-8 text-center text-gray-500">
        <p>基于 Next.js {process.env.NEXT_RUNTIME_VERSION || '15'} 和 @lovrabet/sdk</p>
      </div>
    </div>
  );
}