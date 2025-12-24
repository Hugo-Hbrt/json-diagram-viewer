import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";
import { formatPathForCopy } from "../utils/pathUtils";

function renderAppWithJson(data: unknown, filename: string) {
  render(<App />);
  act(() => {
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "update",
          content: JSON.stringify(data),
          filename,
        },
      })
    );
  });
  return {
    rootCard: screen.getByTestId("root-node"),
  };
}

describe("Copy Path - formatPathForCopy", () => {
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

describe("Copy Path - Context Menu", () => {
  it("should show context menu with 'Copy Path' when right-clicking card header", () => {
    const { rootCard } = renderAppWithJson({ user: { name: "Alice" } }, "test.json");
    const header = rootCard.querySelector(".card-header");

    fireEvent.contextMenu(header!);

    expect(screen.getByText("Copy Path")).toBeInTheDocument();
  });
});
