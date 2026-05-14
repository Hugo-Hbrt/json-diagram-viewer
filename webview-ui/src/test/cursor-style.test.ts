import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const stylesPath = path.resolve(__dirname, "../styles.css");
const css = fs.readFileSync(stylesPath, "utf-8");

function getRuleBody(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`, "m");
  const match = css.match(re);
  if (!match) throw new Error(`Selector not found in styles.css: ${selector}`);
  return match[2];
}

function hasCursorPointer(selector: string): boolean {
  return /cursor\s*:\s*pointer/i.test(getRuleBody(selector));
}

describe("cursor styles (issue #9)", () => {
  it(".property-value should NOT show pointer cursor (not interactive on left-click)", () => {
    expect(hasCursorPointer(".property-value")).toBe(false);
  });

  it(".property-key SHOULD show pointer cursor (clickable to navigate breadcrumb)", () => {
    expect(hasCursorPointer(".property-key")).toBe(true);
  });

  it(".card-header SHOULD show pointer cursor (clickable to expand/select)", () => {
    expect(hasCursorPointer(".card-header")).toBe(true);
  });
});
