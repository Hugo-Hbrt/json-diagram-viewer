# JSON Diagram Viewer

Visualize JSON files as interactive tree diagrams in VS Code.

![JSON Diagram Viewer Demo](json_diagram_example.gif)

## Features

- **Interactive Tree View** — Expand and collapse nodes to explore nested structures
- **Live Sync** — Diagram updates in real-time as you edit your JSON file
- **Color-Coded Cards** — Different colors for root, objects, arrays, and array items
- **Inline Primitives** — Strings, numbers, booleans, and null values displayed directly in cards
- **Side-by-Side Editing** — Diagram opens beside your editor for easy comparison

## Usage

1. Open any `.json` file
2. Run the command **JSON Diagram: View as Diagram** using one of these methods:
   - Right-click in the editor → **View as Diagram**
   - Click the diagram icon in the editor title bar
   - Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) → **JSON Diagram: View as Diagram**

The diagram panel opens beside your editor and stays synchronized with your changes.

## Requirements

- VS Code 1.74.0 or higher

## Known Issues

None at this time. Please report issues on [GitHub](https://github.com/Hugo-Hbrt/json-diagram-viewer/issues).

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for release history.

---

## License

MIT
