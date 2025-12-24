import { describe, it, expect } from "vitest";
import { formatPathForCopy } from "../utils/pathUtils";

describe("formatPathForCopy", () => {
  it.each([
    { path: [], expected: "", desc: "root path (empty array)" },
    { path: ["user"], expected: "user", desc: "single property" },
    { path: ["user", "name"], expected: "user.name", desc: "nested properties" },
    { path: ["items", 0], expected: "items[0]", desc: "array index" },
    { path: ["my-key"], expected: '["my-key"]', desc: "key with special chars" },
    { path: ["items", 0, "name"], expected: "items[0].name", desc: "mixed notation" },
    { path: ["users", 2, "profile", "settings"], expected: "users[2].profile.settings", desc: "deep mixed path" },
    { path: ["data", "my-key", "value"], expected: 'data["my-key"].value', desc: "special char in middle" },
  ])("should format $desc as '$expected'", ({ path, expected }) => {
    expect(formatPathForCopy(path)).toBe(expected);
  });
});
