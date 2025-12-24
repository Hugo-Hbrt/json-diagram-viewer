import { describe, it, expect } from "vitest";
import { formatPathForCopy } from "../utils/pathUtils";

describe("Copy Path - formatPathForCopy", () => {
  it("should return empty string for root path (empty array)", () => {
    expect(formatPathForCopy([])).toBe("");
  });

  it("should return property name for single property path", () => {
    expect(formatPathForCopy(["user"])).toBe("user");
  });
});
