export const siteConfig = {
  language: "zh-CN",
  locale: "zh_CN",
  siteUrl: undefined as string | undefined,
  siteMode: "local" as "local" | "production",
  contentStatus: "ready" as "demo" | "draft" | "ready",
  navigation: [
    { label: "首页", href: "/" },
    { label: "关于金鑫", href: "/about/" },
    { label: "业务与案例", href: "/projects/" },
    { label: "科技创新", href: "/page/zpsgjgqbjztx.html" },
    { label: "新闻中心", href: "/news/" },
    { label: "联系我们", href: "/contact/" },
  ],
  navigationEn: [
    { label: "Home", href: "/en/" },
    { label: "About GSIN", href: "/en/about/" },
    { label: "Business & Projects", href: "/en/projects/" },
    { label: "Technological Innovation", href: "/en/page/zpsgjgqbjztx.html" },
    { label: "News", href: "/en/news/" },
    { label: "Contact Us", href: "/en/contact/" },
  ],
};
