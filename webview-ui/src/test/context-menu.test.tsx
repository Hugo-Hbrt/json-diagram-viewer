import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";

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

function rightClickAndCopyJson(element: Element | null): void {
  if (!element) throw new Error("Cannot right-click: element is null");
  fireEvent.contextMenu(element);
  fireEvent.click(screen.getByText("Copy JSON"));
}

async function waitForAnimationFrame(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}

describe("Context Menu", () => {
  describe("Menu Behavior", () => {
    it("should show context menu when right-clicking card header", () => {
      const { rootCard } = renderAppWithJson({ user: { name: "Alice" } }, "test.json");
      const header = rootCard.querySelector(".card-header");

      fireEvent.contextMenu(header!);

      expect(screen.getByText("Copy Path")).toBeInTheDocument();
      expect(screen.getByText("Copy JSON")).toBeInTheDocument();
    });

    it("should show context menu when right-clicking property key", () => {
      renderAppWithJson({ name: "Alice", age: 30 }, "test.json");
      const propertyKey = screen.getByText("name:");

      fireEvent.contextMenu(propertyKey);

      expect(screen.getByText("Copy Path")).toBeInTheDocument();
      expect(screen.getByText("Copy JSON")).toBeInTheDocument();
    });

    it("should show context menu when right-clicking property value", () => {
      renderAppWithJson({ name: "Alice" }, "test.json");
      const propertyValue = screen.getByText('"Alice"');

      fireEvent.contextMenu(propertyValue);

      expect(screen.getByText("Copy Path")).toBeInTheDocument();
      expect(screen.getByText("Copy JSON")).toBeInTheDocument();
    });

    it("should show 'Copy JSON' below 'Copy Path' in menu", () => {
      renderAppWithJson({ test: "value" }, "test.json");

      const propertyKey = screen.getByText("test:");
      fireEvent.contextMenu(propertyKey);

      const menuButtons = screen.getAllByRole("button");
      const copyPath = screen.getByText("Copy Path");
      const copyJson = screen.getByText("Copy JSON");
      const copyPathIndex = menuButtons.indexOf(copyPath);
      const copyJsonIndex = menuButtons.indexOf(copyJson);

      expect(copyJsonIndex).toBeGreaterThan(copyPathIndex);
    });

    it("should close context menu after clicking menu item", () => {
      const { rootCard } = renderAppWithJson({ user: { name: "Alice" } }, "test.json");
      const header = rootCard.querySelector(".card-header");

      fireEvent.contextMenu(header!);
      fireEvent.click(screen.getByText("Copy Path"));

      expect(screen.queryByText("Copy Path")).not.toBeInTheDocument();
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

  describe("Copy Path", () => {
    it("should copy correct path for nested card", () => {
      const { rootCard } = renderAppWithJson({ user: { name: "Alice" } }, "test.json");

      expandCard(rootCard);
      const userCard = getChildNode(rootCard);
      const userHeader = userCard?.querySelector(".card-header");

      rightClickAndCopyPath(userHeader!);

      expect(mockWriteText).toHaveBeenCalledWith("user");
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
  });

  describe("Copy JSON - Primitive Values", () => {
    it("should copy string value with quotes from property key", () => {
      renderAppWithJson({ name: "Alice" }, "test.json");

      const propertyKey = screen.getByText("name:");
      rightClickAndCopyJson(propertyKey);

      expect(mockWriteText).toHaveBeenCalledWith('"Alice"');
    });

    it("should copy string value with quotes from property value", () => {
      renderAppWithJson({ name: "Alice" }, "test.json");

      const propertyValue = screen.getByText('"Alice"');
      rightClickAndCopyJson(propertyValue);

      expect(mockWriteText).toHaveBeenCalledWith('"Alice"');
    });

    it("should copy number value without quotes", () => {
      renderAppWithJson({ age: 30 }, "test.json");

      const propertyKey = screen.getByText("age:");
      rightClickAndCopyJson(propertyKey);

      expect(mockWriteText).toHaveBeenCalledWith("30");
    });

    it("should copy boolean value", () => {
      renderAppWithJson({ active: true }, "test.json");

      const propertyKey = screen.getByText("active:");
      rightClickAndCopyJson(propertyKey);

      expect(mockWriteText).toHaveBeenCalledWith("true");
    });

    it("should copy null value", () => {
      renderAppWithJson({ data: null }, "test.json");

      const propertyKey = screen.getByText("data:");
      rightClickAndCopyJson(propertyKey);

      expect(mockWriteText).toHaveBeenCalledWith("null");
    });
  });

  describe("Copy JSON - Complex Types", () => {
    it("should copy nested object with pretty formatting", () => {
      const { rootCard } = renderAppWithJson({ user: { name: "Alice", age: 30 } }, "test.json");

      expandCard(rootCard);
      const userCard = getChildNode(rootCard);
      const userHeader = userCard?.querySelector(".card-header");

      rightClickAndCopyJson(userHeader || null);

      const expectedJson = JSON.stringify({ name: "Alice", age: 30 }, null, 2);
      expect(mockWriteText).toHaveBeenCalledWith(expectedJson);
    });

    it("should copy array with pretty formatting", () => {
      const { rootCard } = renderAppWithJson({ items: [1, 2, 3] }, "test.json");

      expandCard(rootCard);
      const itemsCard = getChildNode(rootCard);
      const itemsHeader = itemsCard?.querySelector(".card-header");

      rightClickAndCopyJson(itemsHeader || null);

      const expectedJson = JSON.stringify([1, 2, 3], null, 2);
      expect(mockWriteText).toHaveBeenCalledWith(expectedJson);
    });

    it("should copy entire document from root card", () => {
      const { rootCard } = renderAppWithJson({ a: 1, b: 2 }, "test.json");

      const rootHeader = rootCard.querySelector(".card-header");
      rightClickAndCopyJson(rootHeader);

      const expectedJson = JSON.stringify({ a: 1, b: 2 }, null, 2);
      expect(mockWriteText).toHaveBeenCalledWith(expectedJson);
    });
  });
});
