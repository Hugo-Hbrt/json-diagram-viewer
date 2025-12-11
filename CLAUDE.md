# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run compile    # One-time TypeScript compilation
npm run watch      # Continuous compilation (watches for changes)
npm run lint       # Run ESLint on src/
```

## Running the Extension

Press `F5` in VS Code to launch the Extension Development Host with the test folder configured in `.vscode/launch.json`.

## Architecture

This is a VS Code extension that visualizes JSON files as interactive tree diagrams.

**Entry Point**: `src/extension.ts`
- Registers the `jsonDiagramViewer.viewAsDiagram` command
- Sets up document change listeners for live sync (updates diagram on save and while typing)

**Webview Panel**: `src/JsonDiagramPanel.ts`
- Singleton pattern (`currentPanel`) - only one diagram panel exists at a time
- `createOrShow()` creates or reveals the webview panel
- `updateIfVisible()` sends JSON content to the webview when the source document changes
- `_getHtmlForWebview()` returns a self-contained HTML document with embedded CSS and JavaScript for rendering the diagram

**Webview Communication**: Extension sends `{ type: 'update', content: jsonString }` messages to the webview via `postMessage()`. The webview's JavaScript parses the JSON and renders the tree.

**Rendering Logic** (inside webview):
- `renderNode()` recursively builds HTML for JSON nodes
- Primitives displayed inline in cards; objects/arrays expand as child cards
- Card types (root, array-item, nested-object, array, object) have distinct header colors
- Collapse state tracked in a `Set` and preserved across re-renders
