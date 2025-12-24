import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";
import { formatPathForCopy } from "../utils/pathUtils";

const mockWriteText = vi.fn();

beforeEach(() => {
  mockWriteText.mockClear();
  Object.assign(navigator, {
    clipboard: { writeText: mockWriteText },
  });
});

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

  it("should close context menu after clicking 'Copy Path'", () => {
    const { rootCard } = renderAppWithJson({ user: { name: "Alice" } }, "test.json");
    const header = rootCard.querySelector(".card-header");

    fireEvent.contextMenu(header!);
    fireEvent.click(screen.getByText("Copy Path"));

    expect(screen.queryByText("Copy Path")).not.toBeInTheDocument();
  });

  it("should copy correct path for nested card", () => {
    const { rootCard } = renderAppWithJson({ user: { name: "Alice" } }, "test.json");

    // Expand root to show user card
    const toggle = rootCard.querySelector(".card-header .toggle");
    fireEvent.click(toggle!);

    // Find the user card and right-click it
    const userCard = rootCard.querySelector(".children-container .node");
    const userHeader = userCard?.querySelector(".card-header");
    fireEvent.contextMenu(userHeader!);
    fireEvent.click(screen.getByText("Copy Path"));

    expect(mockWriteText).toHaveBeenCalledWith("user");
  });

  it("should show context menu when right-clicking property key", () => {
    const { rootCard } = renderAppWithJson({ name: "Alice", age: 30 }, "test.json");
    const propertyKey = rootCard.querySelector(".property-key");

    fireEvent.contextMenu(propertyKey!);

    expect(screen.getByText("Copy Path")).toBeInTheDocument();
  });

  it("should copy correct path for property key", () => {
    const { rootCard } = renderAppWithJson({ user: { name: "Alice" } }, "test.json");

    // Expand root to show user card
    const toggle = rootCard.querySelector(".card-header .toggle");
    fireEvent.click(toggle!);

    // Find the user card and select it (which expands it since it's collapsed)
    const userCard = rootCard.querySelector(".children-container .node");
    const userHeader = userCard?.querySelector(".card-header span");
    fireEvent.click(userHeader!);

    // Find the "name" property key and right-click it
    const namePropertyKey = screen.getByText("name:");
    fireEvent.contextMenu(namePropertyKey);
    fireEvent.click(screen.getByText("Copy Path"));

    expect(mockWriteText).toHaveBeenCalledWith("user.name");
  });
});
