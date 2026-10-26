# 外部询盘邮件服务接入

网站路径：`C:/Users/PC/Desktop/new-gsin/jinxin-official-site`。

独立 Node.js 服务路径：`C:/Users/PC/AppData/Local/hermes/profiles/website-builder/workspace/website-inquiry-service`。

网站保持 Astro 静态输出，通过共享组件 `src/components/CompanyContact.astro` 和 `src/lib/inquiry.ts` 调用外部 `/inquiry` 接口。覆盖 `/contact/`、`/en/contact/`、`/page/lxwm.html`、`/en/page/lxwm.html`。服务无数据库，通过 Resend 发送。发件地址和收件邮箱写在服务 `config.json` 里与本站来源匹配的那一条，网页不能指定收件人。邮件不设置 Reply-To；访客填写的邮箱在邮件正文中。

## 本地配置

1. 在服务 `config.json` 的对应 `sites` 条目填写 `mailFrom`、`mailTo` 和 `origins`。`mailFrom` 必须属于已在 Resend 验证的域名。本地来源使用 `http://127.0.0.1:4321` 与 `http://localhost:4321`。
2. 在服务目录复制 `.env.example` 为 `.env`，填写 `RESEND_API_KEY`。密钥只保存在服务端，不能放入网站的 `PUBLIC_` 变量，也不提交仓库或发送到聊天。
3. 网站只需要 `PUBLIC_INQUIRY_ENDPOINT`；本地已配置为 `http://127.0.0.1:8787/inquiry`。
4. 在服务目录运行 `npm start`，访问 `http://127.0.0.1:8787/health`。`ok:true` 代表进程存活；`ready:false` 代表配置尚未完成，不能发送真实询盘。
5. 在网站目录运行 `npm run dev -- --host 127.0.0.1 --port 4321`，打开 `http://127.0.0.1:4321/contact/`。如果端口变化，把新来源写进该站的 `origins`。修改配置后分别重启对应进程。
6. 配置齐全后，用获准的测试内容确认指定邮箱收到邮件，发件人是该站的 `mailFrom`，正文包含所填内容。没有密钥或站点配置无效时，服务返回暂不可用，不假装发送成功。

正式构建使用 `https://website-inquiry.fanfu749.workers.dev/inquiry`。该地址写在已提交的 `.env.production`，并作为 `site.config.ts` 的默认值。本地 `.env` 仍可指向 `http://127.0.0.1:8787/inquiry`，只影响本机预览。发件地址是 `inquiry@fuliang.online`，收件邮箱是 `Hi-Strong@VIP.163.com`。询盘服务已允许来源 `https://gsin.fuliang.online`。

## 页面行为

- 必填与长度校验、隐藏防刷字段、等待期间防重复点击；服务端执行来源匹配、正文限制和 IP 限流。
- 只有服务明确确认接受发送才清空表单；发送失败或结果不确定时保留当前页面内容。
- 2026-10-26 本地新增全服务发信硬限制：所有网站共用最近 1 小时 50 次、最近 24 小时 100 次额度。收到 `429 send_quota_exceeded` 时，中文显示“当前发送人数过多，请稍后再发”，英文显示对应提示；保留已填内容，恢复提交按钮，不自动重试。服务端占用额度后失败或超时也计入，避免突破上限。
- 同一页面相同内容重试沿用编号，通过 Resend 幂等键减少重复。不存入浏览器持久化存储，刷新会丢失输入。
- 缺少接口地址配置或关闭 JavaScript 时禁用提交，显示暂不可用。服务密钥缺失或网络失败不会显示成功。
- 页面上的企业公开联系邮箱仍取自 `src/data/company.json`；它与服务端询盘收件配置分别维护。

## 服务器部署

正式询盘入口是 Cloudflare Worker `website-inquiry`：`https://website-inquiry.fanfu749.workers.dev/inquiry`。发布本网站时重新构建，页面才会带上这个地址。公开网站不能调用本机或内网 HTTP。

## 当前范围

代码已按多站点 Resend 方案接入，并明确不需要 Turnstile，也不提供邮件回复。询盘 Worker 已发布。正式网站需要把本次改动推送到 `main`，等 Cloudflare 重新构建后，`https://gsin.fuliang.online/contact/` 才会调用该 Worker。收件服务接受请求不等于邮件最终进入收件箱。

当前没有人机验证，来源匹配不是身份认证，脚本仍可能模拟请求；限流和隐藏字段只能减少滥用。如果公开后出现持续垃圾询盘，再按实际情况加强反向代理限流或增加防刷措施。

上述小时／日额度及提示本轮仅在本地完成；需部署新版询盘 Worker（包含 Durable Object 绑定和迁移）并重建发布本网站才线上生效。计数存储只保存时间戳，不保存询盘内容；当前没有推送或部署。
