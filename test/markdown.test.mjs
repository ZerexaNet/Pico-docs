import test from "node:test";
import assert from "node:assert/strict";
import { parseMarkdown } from "../src/markdown.mjs";

test("parseMarkdown should return html with headings and toc", () => {
  const markdown = `# Title

## Section

Paragraph with **bold** and [link](./next.md) plus \`inline\`.

- one
- two`;

  const { html, toc, firstHeading } = parseMarkdown(markdown, {
    resolveLink: () => "/next/"
  });

  assert.equal(firstHeading, "Title");
  assert.equal(toc.length, 2);
  assert.match(html, /<h1 id="title">Title<\/h1>/);
  assert.match(html, /<h2 id="section">Section<\/h2>/);
  assert.match(html, /<a href="\/next\/">link<\/a>/);
  assert.match(html, /<code>inline<\/code>/);
  assert.match(html, /<ul>\s*<li>one<\/li>\s*<li>two<\/li>\s*<\/ul>/);
});

test("parseMarkdown should support admonition blocks", () => {
  const markdown = `> [!WARNING]
> 这个比较并不完全公平 Pumpkin 目前的功能远少于其他服务器。`;

  const { html } = parseMarkdown(markdown);
  assert.match(html, /<aside class="admonition admonition-warning">/);
  assert.match(html, /<p class="admonition-title">警告<\/p>/);
  assert.match(html, /这个比较并不完全公平/);
});

test("parseMarkdown should support task list syntax", () => {
  const markdown = `- [x] 玩家链接协议
- [x] 方块
- [x] 生物(和他们的ai，虽然很智障就是了)
- [x] 地形生成
- [x] LINEAR V2存档(包含mca自动转换)
- [x] 方块Tick逻辑
- [x] 玩家链接协议
- [ ] 更多原版特性！
- [ ] TFL插件([另一个项目,直接合并到DocFlow了,只有旧版的有仓库](https://github.com/hekuo5310/TranforCpp))支持
- [ ] Spigot插件支持
- [ ] 对非1.12.2玩家协议的支持（更建议套viaproxy）
- [ ] 对基岩版玩家的支持`;

  const { html } = parseMarkdown(markdown);
  assert.match(html, /<ul class="task-list">/);
  assert.match(html, /<li class="task-list-item checked">/);
  assert.match(html, /<li class="task-list-item pending">/);
  assert.match(html, /<span class="task-list-marker" aria-hidden="true"><\/span>/);
  assert.match(html, /<a href="https:\/\/github\.com\/hekuo5310\/TranforCpp">/);
  assert.match(html, /对基岩版玩家的支持/);
});

test("parseMarkdown should support image link badge syntax", () => {
  const markdown =
    "[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://example.com/repo)";
  const { html } = parseMarkdown(markdown);

  assert.match(html, /<a href="https:\/\/vercel\.com\/new\/clone\?repository-url=https:\/\/example\.com\/repo">/);
  assert.match(html, /<img src="https:\/\/vercel\.com\/button" alt="Deploy with Vercel">/);
});

test("parseMarkdown should support gfm table and strikethrough", () => {
  const markdown = `| 功能 | 状态 |
| :--- | ---: |
| UI | ~~旧版~~ |
| API | 新版 |`;
  const { html } = parseMarkdown(markdown);

  assert.match(html, /<table>/);
  assert.match(html, /<th style="text-align:left">功能<\/th>/);
  assert.match(html, /<th style="text-align:right">状态<\/th>/);
  assert.match(html, /<del>旧版<\/del>/);
});
