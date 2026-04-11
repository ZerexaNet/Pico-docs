import test from "node:test";
import assert from "node:assert/strict";
import { renderPage } from "../src/template.mjs";

test("renderPage should render custom header settings", () => {
  const html = renderPage({
    siteName: "DocFlow 文档",
    siteDescription: "desc",
    header: {
      sticky: false,
      background: "transparent",
      logo: {
        text: "DocFlow",
        link: "/",
        image: "/assets/logo.png",
        alt: "DocFlow Logo"
      },
      rightButtons: [
        { text: "GitHub", link: "https://example.com", newTab: true, style: "filled" }
      ]
    },
    i18n: {
      enabled: true,
      endpoint: "https://deepl.io.hk.cn/translate",
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
    page: {
      title: "Home",
      route: "/",
      html: "<h1>Home</h1>",
      toc: []
    },
    navItems: [{ text: "首页", link: "/" }],
    sidebarGroups: [],
    previousPage: null,
    nextPage: null
  });

  assert.match(html, /class="topbar topbar-static topbar-bg-transparent"/);
  assert.match(html, /class="brand-image"/);
  assert.match(html, /class="header-action filled"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /data-i18n-switcher/);
  assert.match(html, /id="i18n-config"/);
  assert.match(html, /"endpoint":"https:\/\/deepl\.io\.hk\.cn\/translate"/);
});

test("renderPage should fallback to default header background", () => {
  const html = renderPage({
    siteName: "DocFlow 文档",
    siteDescription: "desc",
    header: {
      background: "unknown"
    },
    i18n: {
      enabled: false
    },
    page: {
      title: "Home",
      route: "/",
      html: "<h1>Home</h1>",
      toc: []
    },
    navItems: [],
    sidebarGroups: [],
    previousPage: null,
    nextPage: null
  });

  assert.match(html, /class="topbar topbar-sticky topbar-bg-solid"/);
  assert.doesNotMatch(html, /data-i18n-switcher/);
});

test("renderPage should apply custom base path to internal links and assets", () => {
  const html = renderPage({
    siteName: "DocFlow 文档",
    siteDescription: "desc",
    base: "/DocFlow/",
    header: {
      logo: {
        text: "DocFlow",
        link: "/",
        image: "/assets/logo.png",
        alt: "DocFlow Logo"
      },
      rightButtons: [{ text: "开始", link: "/guide/getting-started/" }]
    },
    i18n: {
      enabled: false
    },
    page: {
      title: "Home",
      route: "/",
      html: '<p><a href="/guide/getting-started/">Start</a></p>',
      toc: []
    },
    navItems: [{ text: "首页", link: "/" }],
    sidebarGroups: [{ title: "概览", items: [{ route: "/", title: "首页" }] }],
    previousPage: null,
    nextPage: { route: "/guide/getting-started/", title: "快速开始" }
  });

  assert.match(html, /href="\/DocFlow\/assets\/style\.css"/);
  assert.match(html, /src="\/DocFlow\/assets\/app\.js"/);
  assert.match(html, /src="\/DocFlow\/assets\/logo\.png"/);
  assert.match(html, /href="\/DocFlow\/guide\/getting-started\/"/);
});
