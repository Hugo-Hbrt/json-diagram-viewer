import {
  render,
  screen,
  act,
  getByText,
  queryByText,
  fireEvent,
} from "@testing-library/react";

import { describe, it, expect, vi } from "vitest";
import App from "../App";

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
    breadcrumb: screen.getByTestId("breadcrumb"),
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
  const header = node.querySelector(".card-header");
  if (!header) throw new Error("Cannot select card: no .card-header found");
  const title = header.querySelector("span");
  if (!title) throw new Error("Cannot select card: no title span found");
  fireEvent.click(title);
}

function clickCardHeader(node: Element | null): void {
  if (!node) throw new Error("Cannot click header: node is null");
  const header = node.querySelector(".card-header");
  if (!header) throw new Error("Cannot click header: no .card-header found");
  fireEvent.click(header);
}

function getChildNode(
  parent: Element | null,
  selector = ".children-container .node"
): Element | null {
  if (!parent) return null;
  return parent.querySelector(selector);
}

describe("Breadcrumb", () => {
  it("should be rendered when the json is valid", () => {
    renderAppWithJson({ name: "test", value: 42 }, "test.json");
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
  });

  it("should show filename without extension as root card title", () => {
    const { rootCard } = renderAppWithJson({ name: "test" }, "config.json");
    const header = rootCard.querySelector(".card-header span");
    expect(header?.textContent).toBe("config");
  });

  it("should show filename without extension for complex extensions", () => {
    const { rootCard } = renderAppWithJson({ name: "test" }, "data.test.json");
    const header = rootCard.querySelector(".card-header span");
    expect(header?.textContent).toBe("data.test");
  });

  it("should not be rendered when the json is loading", () => {
    render(<App />);
    expect(screen.queryByText("Loading", { exact: false })).toBeInTheDocument();
    expect(screen.queryByTestId("breadcrumb")).not.toBeInTheDocument();
  });

  it.each(["test.json", "data.json"])(
    "should render one level with the filename only",
    (filename) => {
      const { breadcrumb } = renderAppWithJson({ name: "test" }, filename);
      expect(getByText(breadcrumb, filename)).toBeInTheDocument();
      expect(queryByText(breadcrumb, "name")).not.toBeInTheDocument();
    }
  );

  it.each([
    { fieldName: "username", fieldValue: "john" },
    { fieldName: "age", fieldValue: 25 },
    { fieldName: "active", fieldValue: true },
  ])(
    "should add '$fieldName' to breadcrumb when user clicks on it",
    ({ fieldName, fieldValue }) => {
      const { breadcrumb, rootCard } = renderAppWithJson(
        { [fieldName]: fieldValue },
        "test.json"
      );
      fireEvent.click(getByText(rootCard, fieldName, { exact: false }));
      expect(getByText(breadcrumb, fieldName)).toBeInTheDocument();
    }
  );

  it("should add nested object to breadcrumb when clicking property row", () => {
    const { breadcrumb, rootCard } = renderAppWithJson(
      { user: { name: "Alice" } },
      "test.json"
    );
    fireEvent.click(getByText(rootCard, "user", { exact: false }));
    expect(getByText(breadcrumb, "user")).toBeInTheDocument();
  });

  it("should show full path when clicking nested property", () => {
    const { breadcrumb, rootCard } = renderAppWithJson(
      { user: { name: "Alice" } },
      "test.json"
    );
    expandCard(rootCard);
    fireEvent.click(screen.getByText("name", { exact: false }));

    expect(getByText(breadcrumb, "user")).toBeInTheDocument();
    expect(getByText(breadcrumb, "name")).toBeInTheDocument();
  });

  it("should show array index when clicking array item", () => {
    const { breadcrumb, rootCard } = renderAppWithJson(
      { items: [{ id: 1 }, { id: 2 }] },
      "test.json"
    );
    expandCard(rootCard);
    expandCard(getChildNode(rootCard));
    fireEvent.click(screen.getByText("items[1]"));

    expect(getByText(breadcrumb, "items")).toBeInTheDocument();
    expect(getByText(breadcrumb, "[1]")).toBeInTheDocument();
  });

  it("should NOT change breadcrumb when clicking breadcrumb segment", () => {
    const { breadcrumb, rootCard } = renderAppWithJson(
      { user: { profile: { details: { name: "Alice" } } } },
      "test.json"
    );

    // Navigate to deep path
    expandCard(rootCard);
    const userNode = getChildNode(rootCard);
    expandCard(userNode);
    const profileNode = getChildNode(userNode);
    selectCard(profileNode); // Select profile to update breadcrumb

    // Click "user" in breadcrumb - should only scroll, not change breadcrumb
    fireEvent.click(getByText(breadcrumb, "user"));

    // Breadcrumb should still show full path
    expect(getByText(breadcrumb, "user")).toBeInTheDocument();
    expect(getByText(breadcrumb, "profile")).toBeInTheDocument();
  });

  it("should NOT change breadcrumb when clicking filename", () => {
    const { breadcrumb, rootCard } = renderAppWithJson(
      { user: { name: "Alice" } },
      "test.json"
    );
    fireEvent.click(getByText(rootCard, "user", { exact: false }));
    fireEvent.click(getByText(breadcrumb, "test.json"));

    // Breadcrumb should still show "user"
    expect(getByText(breadcrumb, "test.json")).toBeInTheDocument();
    expect(getByText(breadcrumb, "user")).toBeInTheDocument();
  });

  it("should show full path for property inside array item", () => {
    const { breadcrumb, rootCard } = renderAppWithJson(
      { items: [{ details: { name: "first" } }] },
      "test.json"
    );
    expandCard(rootCard);
    const itemsNode = getChildNode(rootCard);
    expandCard(itemsNode);
    const firstItemNode = getChildNode(itemsNode);
    expandCard(firstItemNode);
    const detailsNode = getChildNode(firstItemNode);
    // Click on details to select it and update breadcrumb
    selectCard(detailsNode);

    expect(getByText(breadcrumb, "items")).toBeInTheDocument();
    expect(getByText(breadcrumb, "[0]")).toBeInTheDocument();
    expect(getByText(breadcrumb, "details")).toBeInTheDocument();
  });

  it("should highlight card when clicking its header", () => {
    const { rootCard } = renderAppWithJson(
      { user: { name: "Alice" } },
      "test.json"
    );
    expandCard(rootCard);
    const userCard = getChildNode(rootCard);

    selectCard(userCard);

    expect(userCard).toHaveClass("selected");
  });

  it("should remove highlight from previous selection when clicking new card", () => {
    const { rootCard } = renderAppWithJson(
      { user: { name: "Alice" }, settings: { theme: "dark" } },
      "test.json"
    );
    expandCard(rootCard);
    const children = rootCard.querySelectorAll(".children-container .node");
    const userCard = children[0];
    const settingsCard = children[1];

    // Click user card
    selectCard(userCard);
    expect(userCard).toHaveClass("selected");

    // Click settings card
    selectCard(settingsCard);
    expect(settingsCard).toHaveClass("selected");
    expect(userCard).not.toHaveClass("selected");
  });

  it("should show full path for deep nesting", () => {
    const { breadcrumb, rootCard } = renderAppWithJson(
      { a: { b: { c: { d: { e: { x: "deep" } } } } } },
      "data.json"
    );

    // Navigate to deepest level
    expandCard(rootCard);
    const aNode = getChildNode(rootCard);
    expandCard(aNode);
    const bNode = getChildNode(aNode);
    expandCard(bNode);
    const cNode = getChildNode(bNode);
    expandCard(cNode);
    const dNode = getChildNode(cNode);
    expandCard(dNode);
    const eNode = getChildNode(dNode);

    // Select "e" to update breadcrumb
    selectCard(eNode);

    // Verify full path is shown
    expect(getByText(breadcrumb, "a")).toBeInTheDocument();
    expect(getByText(breadcrumb, "b")).toBeInTheDocument();
    expect(getByText(breadcrumb, "c")).toBeInTheDocument();
    expect(getByText(breadcrumb, "d")).toBeInTheDocument();
    expect(getByText(breadcrumb, "e")).toBeInTheDocument();
  });

  it("should auto-expand collapsed card when clicking its title", () => {
    const { rootCard } = renderAppWithJson(
      { user: { profile: { name: "Alice" } } },
      "data.json"
    );

    // Expand root to show user card
    expandCard(rootCard);
    const userCard = getChildNode(rootCard);

    // Verify user is collapsed by default
    expect(userCard).toHaveClass("collapsed");

    // Click the title to select - should also expand since it's collapsed
    selectCard(userCard);

    // User should now be expanded and selected
    expect(userCard).not.toHaveClass("collapsed");
    expect(userCard).toHaveClass("selected");
  });

  it("should scroll to ancestor card when clicking breadcrumb segment", () => {
    // Mock scrollIntoView and requestAnimationFrame
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    const { breadcrumb, rootCard } = renderAppWithJson(
      { user: { profile: { details: { name: "Alice" } } } },
      "data.json"
    );

    // Navigate to deep path
    expandCard(rootCard);
    const userCard = getChildNode(rootCard);
    expandCard(userCard);
    const profileCard = getChildNode(userCard);
    expandCard(profileCard);
    const detailsCard = getChildNode(profileCard);
    selectCard(detailsCard);

    // Reset mock to only count calls from breadcrumb click
    scrollIntoViewMock.mockClear();

    // Click "user" in breadcrumb to scroll (but not change selection)
    fireEvent.click(getByText(breadcrumb, "user"));

    // Should scroll to the user card (but not change selection)
    expect(scrollIntoViewMock).toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("should scroll to root card when clicking filename in breadcrumb", () => {
    // Mock scrollIntoView and requestAnimationFrame
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    const { breadcrumb, rootCard } = renderAppWithJson(
      { user: { profile: { name: "Alice" } } },
      "data.json"
    );

    // Navigate to nested path
    expandCard(rootCard);
    const userCard = getChildNode(rootCard);
    selectCard(userCard);

    // Reset mock to only count calls from breadcrumb click
    scrollIntoViewMock.mockClear();

    // Click filename in breadcrumb to scroll to root (but not change selection)
    fireEvent.click(getByText(breadcrumb, "data.json"));

    // Should scroll to the root card (but not change selection)
    expect(scrollIntoViewMock).toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("should update breadcrumb when collapsing an ancestor node", () => {
    const { breadcrumb, rootCard } = renderAppWithJson(
      { a: { b: { c: { d: { value: "deep" } } } } },
      "data.json"
    );

    // Navigate to deep path: root -> a -> b -> c -> d
    expandCard(rootCard);
    const aNode = getChildNode(rootCard);
    expandCard(aNode);
    const bNode = getChildNode(aNode);
    expandCard(bNode);
    const cNode = getChildNode(bNode);
    expandCard(cNode);
    const dNode = getChildNode(cNode);
    selectCard(dNode);

    // Verify we're 4 levels deep
    expect(getByText(breadcrumb, "a")).toBeInTheDocument();
    expect(getByText(breadcrumb, "b")).toBeInTheDocument();
    expect(getByText(breadcrumb, "c")).toBeInTheDocument();
    expect(getByText(breadcrumb, "d")).toBeInTheDocument();

    // Collapse "b" node (an ancestor)
    expandCard(bNode); // toggle to collapse

    // Breadcrumb should be truncated to "b"
    expect(getByText(breadcrumb, "a")).toBeInTheDocument();
    expect(getByText(breadcrumb, "b")).toBeInTheDocument();
    expect(queryByText(breadcrumb, "c")).not.toBeInTheDocument();
    expect(queryByText(breadcrumb, "d")).not.toBeInTheDocument();

    // "b" should stay collapsed
    expect(bNode).toHaveClass("collapsed");
  });

  it("should update breadcrumb when clicking card header (not just title span)", () => {
    const { breadcrumb, rootCard } = renderAppWithJson(
      { user: { name: "Alice" } },
      "data.json"
    );

    // Expand root to show user card
    expandCard(rootCard);
    const userCard = getChildNode(rootCard);

    // Click on the card header div (not the title span)
    clickCardHeader(userCard);

    // Breadcrumb should show "user"
    expect(getByText(breadcrumb, "user")).toBeInTheDocument();
    // Card should be selected
    expect(userCard).toHaveClass("selected");
  });

  it("should NOT scroll when clicking card header", () => {
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    const { rootCard } = renderAppWithJson(
      { user: { name: "Alice" } },
      "data.json"
    );

    expandCard(rootCard);
    const userCard = getChildNode(rootCard);

    // Click card header to select
    selectCard(userCard);

    // Should NOT scroll when clicking card header
    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
