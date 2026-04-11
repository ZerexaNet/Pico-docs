export function normalizeBasePath(base) {
  if (typeof base !== "string") return "/";

  const trimmed = base.trim();
  if (!trimmed) return "/";

  if (/^https?:\/\//iu.test(trimmed)) {
    return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const normalized = withLeadingSlash.replace(/\/{2,}/gu, "/");
  const withoutTrailingSlash = normalized.replace(/\/+$/u, "");
  return withoutTrailingSlash ? `${withoutTrailingSlash}/` : "/";
}

export function withBasePath(href, base) {
  if (typeof href !== "string") return "";

  const trimmed = href.trim();
  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return trimmed;
  }

  const normalizedBase = normalizeBasePath(base);
  if (normalizedBase === "/") return trimmed;

  const [pathPart, suffix = ""] = splitPathAndSuffix(trimmed);
  if (alreadyPrefixedByBase(pathPart, normalizedBase)) {
    return `${pathPart}${suffix}`;
  }

  const cleanPath = pathPart.replace(/^\/+/u, "");
  if (!cleanPath) return `${normalizedBase}${suffix}`;

  return `${normalizedBase}${cleanPath}${suffix}`;
}

function splitPathAndSuffix(value) {
  const queryIndex = value.indexOf("?");
  const hashIndex = value.indexOf("#");
  let splitIndex = -1;

  if (queryIndex === -1) {
    splitIndex = hashIndex;
  } else if (hashIndex === -1) {
    splitIndex = queryIndex;
  } else {
    splitIndex = Math.min(queryIndex, hashIndex);
  }

  if (splitIndex === -1) {
    return [value, ""];
  }

  return [value.slice(0, splitIndex), value.slice(splitIndex)];
}

function alreadyPrefixedByBase(pathPart, normalizedBase) {
  if (!normalizedBase.startsWith("/") || normalizedBase === "/") return false;
  const basePrefix = normalizedBase.slice(0, -1);
  return pathPart === basePrefix || pathPart.startsWith(`${basePrefix}/`);
}
