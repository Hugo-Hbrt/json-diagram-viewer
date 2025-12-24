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

function expandCard(node: Element | null): void {
  if (!node) throw new Error("Cannot expand card: node is null");
  const toggle = node.querySelector(".card-header .toggle");
  if (!toggle) throw new Error("Cannot expand card: no .toggle found");
  fireEvent.click(toggle);
}

function selectCard(node: Element | null): void {
  if (!node) throw new Error("Cannot select card: node is null");
  const header = node.querySelector(".card-header span");
  if (!header) throw new Error("Cannot select card: no header span found");
  fireEvent.click(header);
}

function getChildNode(parent: Element | null): Element | null {
  if (!parent) return null;
  return parent.querySelector(".children-container .node");
}

function rightClickAndCopyPath(element: Element | null): void {
  if (!element) throw new Error("Cannot right-click: element is null");
  fireEvent.contextMenu(element);
  fireEvent.click(screen.getByText("Copy Path"));
}

async function waitForAnimationFrame(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
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

    expandCard(rootCard);
    const userCard = getChildNode(rootCard);
    const userHeader = userCard?.querySelector(".card-header");

    rightClickAndCopyPath(userHeader!);

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

    expandCard(rootCard);
    const userCard = getChildNode(rootCard);
    selectCard(userCard);

    const namePropertyKey = screen.getByText("name:");
    rightClickAndCopyPath(namePropertyKey);

    expect(mockWriteText).toHaveBeenCalledWith("user.name");
  });

  it("should close context menu when clicking outside", async () => {
    const { rootCard } = renderAppWithJson({ user: { name: "Alice" } }, "test.json");
    const header = rootCard.querySelector(".card-header");

    fireEvent.contextMenu(header!);
    expect(screen.getByText("Copy Path")).toBeInTheDocument();

    await waitForAnimationFrame();
    fireEvent.click(document.body);

    expect(screen.queryByText("Copy Path")).not.toBeInTheDocument();
  });

  it("should close context menu when right-clicking elsewhere", async () => {
    const { rootCard } = renderAppWithJson({ user: { name: "Alice" } }, "test.json");
    const header = rootCard.querySelector(".card-header");

    fireEvent.contextMenu(header!);
    expect(screen.getByText("Copy Path")).toBeInTheDocument();

    await waitForAnimationFrame();
    fireEvent.contextMenu(document.body);

    expect(screen.queryByText("Copy Path")).not.toBeInTheDocument();
  });
});
