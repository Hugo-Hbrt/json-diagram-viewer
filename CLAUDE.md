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

## Commit Convention

This project uses [Conventional Commits](https://conventionalcommits.org) for automated changelog generation via release-please.

**Format:** `<type>(<scope>): <description>`

**Types:**
- `feat:` - New feature (triggers minor version bump)
- `fix:` - Bug fix (triggers patch version bump)
- `docs:` - Documentation only
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring (no feature or fix)
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependencies, CI

**Breaking changes:** Add `!` after type or include `BREAKING CHANGE:` in footer (triggers major version bump)

**Examples:**
```
feat: add zoom controls to diagram view
fix: prevent crash when JSON contains circular references
feat(webview): add dark mode support
fix!: change default collapse behavior
chore: update dependencies
```

**Release workflow:** Push to master triggers release-please to create/update a release PR. Merging that PR creates a GitHub release and publishes to VS Code Marketplace.
