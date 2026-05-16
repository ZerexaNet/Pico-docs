export default {
  siteName: "Pico 语言文档",
  siteDescription: "Pico — 伪代码风格的通用编程语言，用 C 实现",
  docsDir: "docs",
  outDir: "dist",
  base: process.env.DOCFLOW_BASE || "/",
  header: {
    sticky: true,
    background: "solid",
    logo: {
      text: "Pico 文档",
      link: "/",
      image: "",
      alt: "Pico"
    },
    rightButtons: [
      {
        text: "GitHub",
        link: "https://github.com/ZerexaNet/Pico",
        newTab: true,
        style: "outline"
      },
      {
        text: "下载",
        link: "https://github.com/ZerexaNet/Pico/releases/latest",
        newTab: true,
        style: "filled"
      }
    ]
  },
  i18n: {
    enabled: false
  }
};
