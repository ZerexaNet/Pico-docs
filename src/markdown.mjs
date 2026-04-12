import { escapeHtml } from "./utils.mjs";

export function slugify(value) {
  const base = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/gu, "")
    .replace(/\s+/gu, "-")
    .replace(/-+/gu, "-");
  return base || "section";
}

export function parseMarkdown(markdown, options = {}) {
  const resolveLink = options.resolveLink || ((href) => href);
  const lines = markdown.replace(/\r\n/gu, "\n").split("\n");
  const htmlParts = [];
  const toc = [];
  const slugCount = new Map();
  const paragraphBuffer = [];
  const quoteBuffer = [];
  let listState = null;
  let codeBlock = null;
  let firstHeading = "";

  function flushParagraph() {
    if (!paragraphBuffer.length) return;
    htmlParts.push(`<p>${parseInline(paragraphBuffer.join(" "), resolveLink)}</p>`);
    paragraphBuffer.length = 0;
  }

  function flushList() {
    if (!listState) return;
    const tag = listState.type === "ordered" ? "ol" : "ul";
    const items = listState.items
      .map((item) => renderListItem(item, resolveLink))
      .join("");
    const listClass = items.includes("task-list-item") ? ' class="task-list"' : "";
    htmlParts.push(`<${tag}${listClass}>${items}</${tag}>`);
    listState = null;
  }

  function flushQuote() {
    if (!quoteBuffer.length) return;
    const firstLine = quoteBuffer[0].trim();
    const alertMatch = firstLine.match(/^\[!([a-z]+)\](?:\s+(.+))?$/iu);

    if (alertMatch) {
      const alertType = alertMatch[1].toLowerCase();
      const explicitTitle = alertMatch[2]?.trim() || "";
      const title = explicitTitle || alertTitleByType(alertType);
      const bodyText = quoteBuffer.slice(1).join(" ").trim();
      const bodyHtml = bodyText ? `<p>${parseInline(bodyText, resolveLink)}</p>` : "";
      htmlParts.push(
        `<aside class="admonition admonition-${escapeHtml(alertType)}"><p class="admonition-title">${parseInline(
          title,
          resolveLink
        )}</p>${bodyHtml}</aside>`
      );
      quoteBuffer.length = 0;
      return;
    }

    const quote = parseInline(quoteBuffer.join(" "), resolveLink);
    htmlParts.push(`<blockquote><p>${quote}</p></blockquote>`);
    quoteBuffer.length = 0;
  }

  function flushCodeBlock() {
    if (!codeBlock) return;
    const languageClass = codeBlock.language ? ` class="language-${escapeHtml(codeBlock.language)}"` : "";
    const code = escapeHtml(codeBlock.lines.join("\n"));
    htmlParts.push(`<pre><code${languageClass}>${code}</code></pre>`);
    codeBlock = null;
  }

  function createHeadingId(rawText) {
    const plain = stripInlineSyntax(rawText);
    const base = slugify(plain);
    const existing = slugCount.get(base) || 0;
    const next = existing + 1;
    slugCount.set(base, next);
    return existing === 0 ? base : `${base}-${next}`;
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (codeBlock) {
      if (/^```/u.test(line.trim())) {
        flushCodeBlock();
      } else {
        codeBlock.lines.push(line);
      }
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    const fenceMatch = trimmed.match(/^```([a-zA-Z0-9_-]+)?$/u);
    if (fenceMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      codeBlock = {
        language: fenceMatch[1] || "",
        lines: []
      };
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/u);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      const level = headingMatch[1].length;
      const rawText = headingMatch[2].trim();
      const text = stripInlineSyntax(rawText);
      const id = createHeadingId(rawText);
      if (!firstHeading) firstHeading = text;
      toc.push({ id, text, level });
      htmlParts.push(`<h${level} id="${id}">${parseInline(rawText, resolveLink)}</h${level}>`);
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/u.test(trimmed)) {
      flushParagraph();
      flushList();
      flushQuote();
      htmlParts.push("<hr>");
      continue;
    }

    if (isTableHeaderLine(line) && isTableSeparatorLine(lines[index + 1])) {
      flushParagraph();
      flushList();
      flushQuote();

      const headerCells = parseTableCells(line);
      const alignments = parseTableAlignments(lines[index + 1]);
      const bodyRows = [];
      index += 2;

      while (index < lines.length) {
        const rowLine = lines[index];
        if (!rowLine || !rowLine.trim() || !rowLine.includes("|")) {
          break;
        }
        bodyRows.push(parseTableCells(rowLine));
        index += 1;
      }
      index -= 1;

      const headerHtml = headerCells
        .map((cell, cellIndex) => {
          const align = alignments[cellIndex] || "";
          const alignAttr = align ? ` style="text-align:${align}"` : "";
          return `<th${alignAttr}>${parseInline(cell, resolveLink)}</th>`;
        })
        .join("");
      const bodyHtml = bodyRows
        .map((row) => {
          const cells = headerCells
            .map((_, cellIndex) => {
              const align = alignments[cellIndex] || "";
              const alignAttr = align ? ` style="text-align:${align}"` : "";
              const value = row[cellIndex] || "";
              return `<td${alignAttr}>${parseInline(value, resolveLink)}</td>`;
            })
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");

      htmlParts.push(
        `<table><thead><tr>${headerHtml}</tr></thead>${bodyRows.length ? `<tbody>${bodyHtml}</tbody>` : ""}</table>`
      );
      continue;
    }

    const quoteMatch = line.match(/^\s*>\s?(.*)$/u);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      quoteBuffer.push(quoteMatch[1]);
      continue;
    }

    const orderedItemMatch = line.match(/^\s*\d+\.\s+(.+)$/u);
    if (orderedItemMatch) {
      flushParagraph();
      flushQuote();
      if (!listState || listState.type !== "ordered") {
        flushList();
        listState = { type: "ordered", items: [] };
      }
      listState.items.push(orderedItemMatch[1].trim());
      continue;
    }

    const unorderedItemMatch = line.match(/^\s*[-*+]\s+(.+)$/u);
    if (unorderedItemMatch) {
      flushParagraph();
      flushQuote();
      if (!listState || listState.type !== "unordered") {
        flushList();
        listState = { type: "unordered", items: [] };
      }
      listState.items.push(unorderedItemMatch[1].trim());
      continue;
    }

    paragraphBuffer.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushQuote();
  flushCodeBlock();

  return {
    html: htmlParts.join("\n"),
    toc,
    firstHeading
  };
}

function stripInlineSyntax(text) {
  return text
    .replace(/`([^`]+)`/gu, "$1")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gu, "$1")
    .replace(/\*\*([^*]+)\*\*/gu, "$1")
    .replace(/\*([^*]+)\*/gu, "$1")
    .replace(/__([^_]+)__/gu, "$1")
    .replace(/_([^_]+)_/gu, "$1")
    .replace(/~~([^~]+)~~/gu, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gu, "$1")
    .trim();
}

function parseInline(text, resolveLink) {
  const codeTokens = [];
  const imageTokens = [];
  let parsed = text.replace(/`([^`]+)`/gu, (_, code) => {
    const token = `%%CODETOKEN${codeTokens.length}%%`;
    codeTokens.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  parsed = parsed.replace(/!\[([^\]]*)\]\(([^)]+)\)/gu, (_, altText, rawTarget) => {
    const token = `%%IMGTOKEN${imageTokens.length}%%`;
    const { href, title } = parseLinkTarget(rawTarget);
    const resolvedSrc = resolveLink(href);
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
    imageTokens.push(`<img src="${escapeHtml(resolvedSrc)}" alt="${escapeHtml(altText)}"${titleAttr}>`);
    return token;
  });

  parsed = escapeHtml(parsed);

  parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/gu, (_, label, href) => {
    const { href: linkHref, title } = parseLinkTarget(href);
    const link = escapeHtml(resolveLink(linkHref));
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
    return `<a href="${link}"${titleAttr}>${label}</a>`;
  });

  parsed = parsed.replace(/~~([^~]+)~~/gu, "<del>$1</del>");
  parsed = parsed.replace(/\*\*([^*]+)\*\*/gu, "<strong>$1</strong>");
  parsed = parsed.replace(/__([^_]+)__/gu, "<strong>$1</strong>");
  parsed = parsed.replace(/(^|[^*])\*([^*]+)\*/gu, "$1<em>$2</em>");
  parsed = parsed.replace(/(^|[^_])_([^_]+)_/gu, "$1<em>$2</em>");

  parsed = parsed.replace(/%%IMGTOKEN(\d+)%%/gu, (_, index) => imageTokens[Number(index)] || "");
  parsed = parsed.replace(/%%CODETOKEN(\d+)%%/gu, (_, index) => codeTokens[Number(index)] || "");

  return parsed;
}

function renderListItem(item, resolveLink) {
  const taskMatch = item.match(/^\[( |x|X)\]\s+(.+)$/u);
  if (!taskMatch) {
    return `<li>${parseInline(item, resolveLink)}</li>`;
  }

  const checked = taskMatch[1].toLowerCase() === "x";
  const text = taskMatch[2];
  const stateClass = checked ? "checked" : "pending";
  return `<li class="task-list-item ${stateClass}"><span class="task-list-marker" aria-hidden="true"></span><span class="task-list-content">${parseInline(
    text,
    resolveLink
  )}</span></li>`;
}

function alertTitleByType(type) {
  const key = String(type).toLowerCase();
  if (key === "note") return "提示";
  if (key === "tip") return "技巧";
  if (key === "important") return "重要";
  if (key === "warning") return "警告";
  if (key === "caution") return "注意";
  return key.toUpperCase();
}

function parseLinkTarget(rawTarget) {
  const source = String(rawTarget || "").trim();
  const titleMatch = source.match(/^(\S+)\s+["'](.+?)["']$/u);
  if (titleMatch) {
    return {
      href: titleMatch[1].trim(),
      title: titleMatch[2].trim()
    };
  }

  return {
    href: source,
    title: ""
  };
}

function isTableHeaderLine(line) {
  if (typeof line !== "string") return false;
  const trimmed = line.trim();
  return trimmed.includes("|") && parseTableCells(trimmed).length > 1;
}

function isTableSeparatorLine(line) {
  if (typeof line !== "string") return false;
  const cells = parseTableCells(line);
  if (cells.length < 2) return false;
  return cells.every((cell) => /^:?-{3,}:?$/u.test(cell.replace(/\s+/gu, "")));
}

function parseTableCells(line) {
  const trimmed = String(line || "").trim().replace(/^\|/u, "").replace(/\|$/u, "");
  return trimmed.split("|").map((cell) => cell.trim());
}

function parseTableAlignments(separatorLine) {
  return parseTableCells(separatorLine).map((cell) => {
    const normalized = cell.replace(/\s+/gu, "");
    if (/^:-+:$/u.test(normalized)) return "center";
    if (/^-+:/u.test(normalized)) return "right";
    if (/^:-+/u.test(normalized)) return "left";
    return "";
  });
}
