# JSON Diagram Viewer

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/Hugo-Hbrt.json-diagram-viewer)](https://marketplace.visualstudio.com/items?itemName=Hugo-Hbrt.json-diagram-viewer)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/Hugo-Hbrt.json-diagram-viewer)](https://marketplace.visualstudio.com/items?itemName=Hugo-Hbrt.json-diagram-viewer)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/Hugo-Hbrt.json-diagram-viewer)](https://marketplace.visualstudio.com/items?itemName=Hugo-Hbrt.json-diagram-viewer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Transform complex JSON into beautiful, interactive tree diagrams right inside VS Code.

Stop scrolling through endless brackets. Visualize your JSON structure instantly with collapsible nodes, color-coded cards, and real-time sync as you edit.

![JSON Diagram Viewer Demo](json_diagram_example.gif)

## Features

- **Interactive Tree View** — Expand and collapse nodes to explore nested structures
- **Live Sync** — Diagram updates in real-time as you edit your JSON file
- **Color-Coded Cards** — Different colors for root, objects, arrays, and array items
- **Inline Primitives** — Strings, numbers, booleans, and null values displayed directly in cards
- **Side-by-Side Editing** — Diagram opens beside your editor for easy comparison
- **Copy Path & Values** — Right-click to copy JSON paths or values

## Installation

1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type `ext install Hugo-Hbrt.json-diagram-viewer`
4. Press Enter

Or search for **"JSON Diagram Viewer"** in the Extensions sidebar.

## Usage

1. Open any `.json` file
2. Run the command **JSON Diagram: View as Diagram** using one of these methods:
   - Right-click in the editor → **View as Diagram**
   - Click the diagram icon in the editor title bar
   - Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) → **JSON Diagram: View as Diagram**

The diagram panel opens beside your editor and stays synchronized with your changes.

## Use Cases

- **API Development** — Visualize API responses and request bodies
- **Configuration Files** — Navigate complex config structures
- **Data Analysis** — Explore JSON datasets with ease
- **Debugging** — Understand nested data at a glance
- **Documentation** — Share visual representations of JSON schemas

## Requirements

- VS Code 1.74.0 or higher

## Known Issues

None at this time. Please report issues on [GitHub](https://github.com/Hugo-Hbrt/json-diagram-viewer/issues).

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on [GitHub](https://github.com/Hugo-Hbrt/json-diagram-viewer).

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for release history.

---

**Enjoying JSON Diagram Viewer?** [Rate it on the Marketplace](https://marketplace.visualstudio.com/items?itemName=Hugo-Hbrt.json-diagram-viewer&ssr=false#review-details) — it helps others discover the extension!

## License

MIT
