export const siteConfig = {
  language: "zh-CN",
  locale: "zh_CN",
  siteUrl: undefined as string | undefined,
  siteMode: "local" as "local" | "production",
  contentStatus: "ready" as "demo" | "draft" | "ready",
  navigation: [
    { label: "首页", href: "/" },
    { label: "钢结构业务", href: "/products/" },
    { label: "工程案例", href: "/projects/" },
    { label: "关于我们", href: "/about/" },
    { label: "联系我们", href: "/contact/" },
  ],
};
