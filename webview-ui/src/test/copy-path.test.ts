import { describe, it, expect } from "vitest";
import { formatPathForCopy } from "../utils/pathUtils";

describe("Copy Path - formatPathForCopy", () => {
  it("should return empty string for root path (empty array)", () => {
    expect(formatPathForCopy([])).toBe("");
  });

  it("should return property name for single property path", () => {
    expect(formatPathForCopy(["user"])).toBe("user");
  });

  it("should use dot notation for nested properties", () => {
    expect(formatPathForCopy(["user", "name"])).toBe("user.name");
  });

  it("should use bracket notation for array indices", () => {
    expect(formatPathForCopy(["items", 0])).toBe("items[0]");
  });

  it("should use bracket notation with quotes for keys with special chars", () => {
    expect(formatPathForCopy(["my-key"])).toBe('["my-key"]');
  });

  it("should handle mixed notation for array items with properties", () => {
    expect(formatPathForCopy(["items", 0, "name"])).toBe("items[0].name");
  });
});
