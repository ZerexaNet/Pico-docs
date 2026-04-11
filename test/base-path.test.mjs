import test from "node:test";
import assert from "node:assert/strict";
import { normalizeBasePath, withBasePath } from "../src/base-path.mjs";

test("normalizeBasePath should normalize slash style", () => {
  assert.equal(normalizeBasePath(""), "/");
  assert.equal(normalizeBasePath("/"), "/");
  assert.equal(normalizeBasePath("/DocFlow"), "/DocFlow/");
  assert.equal(normalizeBasePath("DocFlow"), "/DocFlow/");
  assert.equal(normalizeBasePath("https://example.com/docs"), "https://example.com/docs/");
});

test("withBasePath should prepend base to internal absolute links", () => {
  assert.equal(withBasePath("/assets/style.css", "/DocFlow/"), "/DocFlow/assets/style.css");
  assert.equal(withBasePath("/guide/getting-started/", "/DocFlow/"), "/DocFlow/guide/getting-started/");
  assert.equal(withBasePath("/?a=1#hash", "/DocFlow/"), "/DocFlow/?a=1#hash");
  assert.equal(withBasePath("/DocFlow/guide/getting-started/", "/DocFlow/"), "/DocFlow/guide/getting-started/");
});

test("withBasePath should keep external and non-absolute links unchanged", () => {
  assert.equal(withBasePath("https://example.com", "/DocFlow/"), "https://example.com");
  assert.equal(withBasePath("#section", "/DocFlow/"), "#section");
  assert.equal(withBasePath("./relative", "/DocFlow/"), "./relative");
});
