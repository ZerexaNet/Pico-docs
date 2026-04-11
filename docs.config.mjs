export default {
  siteName: "DocFlow 文档",
  siteDescription: "DocFlow是由node开发的静态文档系统",
  docsDir: "docs",
  outDir: "dist",
  base: "/",
  header: {
    sticky: true,
    background: "solid",
    logo: {
      text: "DocFlow 文档",
      link: "/",
      image: "",
      alt: "DocFlow 文档"
    },
    rightButtons: [
      {
        text: "GitHub",
        link: "https://github.com/ZerexaNet/DocFlow",
        newTab: true
      }
    ]
  },
  i18n: {
    enabled: false,
    endpoint: "/api/translate",
    upstreamEndpoint: "https://deepl.io.hk.cn/translate",
    sourceLang: "zh",
    defaultLang: "zh",
    altCount: 2,
    cache: true,
    autoApplySaved: true,
    languages: [
      { code: "zh", label: "简体中文" },
      { code: "en", label: "English" }
    ]
  },
  nav: [
    { text: "首页", link: "/" },
    { text: "快速开始", link: "/guide/getting-started/" },
    { text: "系统配置", link: "/guide/configuration/" },
    { text: "i18n", link: "/guide/i18n/" },
    { text: "部署", link: "/guide/deployment/" }
  ]
};
