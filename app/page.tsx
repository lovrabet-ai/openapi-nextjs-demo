"use client";

import Link from "next/link";
import { Card, Typography, Row, Col, Alert, Space, Tag } from "antd";
import {
  CloudServerOutlined,
  GlobalOutlined,
  ApiOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const scenarios = [
    {
      key: "scenario1",
      href: "/scenario1-ssr",
      title: "场景1：服务端渲染",
      icon: <CloudServerOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
      description: "Next.js 服务端直接使用 accessKey 调用 OpenAPI，数据在服务端渲染",
      features: [
        { text: "最安全（密钥不暴露）", color: "blue" },
        { text: "SEO 友好", color: "blue" },
        { text: "首屏加载快", color: "blue" },
      ],
      color: "#e6f7ff",
    },
    {
      key: "scenario2",
      href: "/scenario2-browser",
      title: "场景2：浏览器直连",
      icon: <GlobalOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
      description: "浏览器获取 token 后直接调用 OpenAPI，无需后端中转",
      features: [
        { text: "低延迟（直连）", color: "green" },
        { text: "减轻服务器压力", color: "green" },
        { text: "Token 10分钟有效", color: "green" },
      ],
      color: "#f6ffed",
    },
    {
      key: "scenario3",
      href: "/scenario3-proxy",
      title: "场景3：API 中转",
      icon: <ApiOutlined style={{ fontSize: 32, color: "#722ed1" }} />,
      description: "通过 Next.js API Routes 中转，可添加额外的业务逻辑",
      features: [
        { text: "灵活的权限控制", color: "purple" },
        { text: "数据转换和验证", color: "purple" },
        { text: "隐藏 OpenAPI 细节", color: "purple" },
      ],
      color: "#f9f0ff",
    },
  ];

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1400, margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* 标题 */}
        <div>
          <Title level={1}>Lovrabet SDK Next.js 15 演示</Title>
        </div>

        {/* 演示说明 */}
        <Card>
          <Title level={3}>演示说明</Title>
          <Paragraph>
            这是一个使用 Next.js 15 和 Lovrabet SDK
            的演示项目，展示了三种不同的集成模式：
          </Paragraph>
          <Space direction="vertical" size="small">
            <Text>
              App Code: <Tag>app-d31cb8fb</Tag>
            </Text>
            <Text>
              环境: <Tag>online</Tag>
            </Text>
            <Text>
              SDK 版本: <Tag>@lovrabet/sdk (本地开发版)</Tag>
            </Text>
            <Text>使用 Suppliers 数据集（供应商管理）</Text>
          </Space>
        </Card>

        {/* 场景卡片 */}
        <Row gutter={[24, 24]}>
          {scenarios.map((scenario) => (
            <Col xs={24} lg={8} key={scenario.key}>
              <Link href={scenario.href} style={{ textDecoration: "none" }}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    minHeight: 380,
                    borderRadius: 8,
                  }}
                  styles={{
                    body: {
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      padding: 24,
                    },
                  }}
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        minWidth: 64,
                        minHeight: 64,
                        borderRadius: "50%",
                        background: scenario.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {scenario.icon}
                    </div>

                    <div style={{ minHeight: 100 }}>
                      <Title level={4} style={{ marginBottom: 8, marginTop: 0 }}>
                        {scenario.title}
                      </Title>
                      <Paragraph type="secondary" style={{ marginBottom: 16, marginTop: 0 }}>
                        {scenario.description}
                      </Paragraph>
                    </div>

                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                      {scenario.features.map((feature, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center" }}>
                          <CheckCircleOutlined
                            style={{
                              marginRight: 8,
                              fontSize: 14,
                              color: "#52c41a",
                              flexShrink: 0,
                            }}
                          />
                          <Text type="success" style={{ flex: 1 }}>
                            {feature.text}
                          </Text>
                        </div>
                      ))}
                    </Space>
                  </Space>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        {/* 配置提醒 */}
        <Alert
          message="配置提醒"
          description={
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text>
                请在 <Tag>.env.local</Tag> 文件中配置以下环境变量：
              </Text>
              <pre
                style={{
                  background: "#fffbe6",
                  padding: 12,
                  borderRadius: 4,
                  fontSize: 13,
                  margin: "8px 0",
                }}
              >
                {`NEXT_PUBLIC_APP_CODE=app-d31cb8fb
ACCESS_KEY=ak-_7jQfu0QyEsd3erpcZ45gLmxm9vM_OdfuCt7dy_u6lM
NEXT_PUBLIC_API_ENV=online`}
              </pre>
              <Text type="warning">
                注意：ACCESS_KEY 仅在服务端使用，永远不要暴露给客户端！
              </Text>
            </Space>
          }
          type="warning"
          showIcon
        />

        {/* 页脚 */}
        <div style={{ textAlign: "center", paddingTop: 24 }}>
          <Text type="secondary">
            基于 Next.js {process.env.NEXT_RUNTIME_VERSION || "15"} 和
            @lovrabet/sdk
          </Text>
        </div>
      </Space>
    </div>
  );
}
