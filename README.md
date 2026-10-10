# 深圳金鑫绿建股份有限公司 企业网站

本仓库是深圳金鑫绿建股份有限公司的中文企业网站源码，基于 Astro + Tailwind CSS 构建。网站内容覆盖钢结构业务方向、10 个工程案例、公司简介与联系方式，并只使用经确认可公开的公司事实、项目资料与图片。

## 页面结构

- `/` 首页
- `/products/` 钢结构业务（5 条业务方向，含各自详情页）
- `/projects/` 工程案例（10 个工程项目，含各自详情页）
- `/about/` 关于我们
- `/contact/` 联系我们

## 环境要求

- Node.js 22+
- npm 10+

## 命令

```bash
npm ci --include=optional
npm run dev
npm run verify:quick
npm run verify
```

## 内容说明

- 公司事实与联系方式来自 `src/data/company.json`，不要在页面组件中重复硬编码。
- 业务方向内容位于 `src/content/products/`，工程案例内容位于 `src/content/projects/`。
- 公开图片位于 `public/media/`；原始资料与内部记录保留在 `materials/` 与 `notes/`，两者均为私有输入。
- 网站当前为 `local`（noindex）模式，因为本轮交付为 workers.dev 预览，尚未绑定正式域名。

## 未纳入本轮范围

部署到自有域名、DNS、HTTPS、后台管理系统、数据库、在线表单与移动端专项适配。
