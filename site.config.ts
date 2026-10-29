export const siteConfig = {
  language: "zh-CN",
  locale: "zh_CN",
  siteUrl: "https://www.szgsin.com/" as string | undefined,
  siteMode: "production" as "local" | "production",
  contentStatus: "ready" as "demo" | "draft" | "ready",
  inquiry: {
    // Public build-time URL. Cloudflare builds have no local .env, so production
    // uses the deployed Worker unless PUBLIC_INQUIRY_ENDPOINT overrides it.
    endpoint: import.meta.env.PUBLIC_INQUIRY_ENDPOINT?.trim()
      || "https://website-inquiry.fanfu749.workers.dev/inquiry",
  },
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
