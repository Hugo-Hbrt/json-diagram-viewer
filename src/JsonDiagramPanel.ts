import * as vscode from 'vscode';

export class JsonDiagramPanel {
    public static currentPanel: JsonDiagramPanel | undefined;
    public static readonly viewType = 'jsonDiagramViewer';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _currentDocumentUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri, document: vscode.TextDocument) {
        const column = vscode.ViewColumn.Beside;

        // If we already have a panel, show it
        if (JsonDiagramPanel.currentPanel) {
            JsonDiagramPanel.currentPanel._panel.reveal(column);
            JsonDiagramPanel.currentPanel._currentDocumentUri = document.uri;
            JsonDiagramPanel.currentPanel._update(document.getText());
            return;
        }

        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(
            JsonDiagramPanel.viewType,
            'JSON Diagram',
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        JsonDiagramPanel.currentPanel = new JsonDiagramPanel(panel, extensionUri, document);
    }

    public static updateIfVisible(document: vscode.TextDocument) {
        if (JsonDiagramPanel.currentPanel &&
            JsonDiagramPanel.currentPanel._currentDocumentUri.toString() === document.uri.toString()) {
            JsonDiagramPanel.currentPanel._update(document.getText());
        }
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, document: vscode.TextDocument) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._currentDocumentUri = document.uri;

        // Set the webview's initial html content
        this._panel.webview.html = this._getHtmlForWebview();

        // Initial update with document content
        this._update(document.getText());

        // Listen for when the panel is disposed
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    public dispose() {
        JsonDiagramPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update(jsonContent: string) {
        this._panel.webview.postMessage({
            type: 'update',
            content: jsonContent
        });
    }

    private _getHtmlForWebview(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSON Diagram</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            overflow: auto;
        }

        .diagram-container {
            display: flex;
            align-items: flex-start;
            min-height: 100vh;
            padding: 20px;
        }

        .node {
            position: relative;
            margin: 10px 0;
        }

        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            min-width: 200px;
            max-width: 350px;
            overflow: hidden;
        }

        .card-header {
            padding: 8px 12px;
            font-weight: 600;
            font-size: 13px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            user-select: none;
        }

        .card-header:hover {
            filter: brightness(1.1);
        }

        .card-header .toggle {
            font-size: 10px;
            transition: transform 0.2s;
        }

        .card-header .toggle.collapsed {
            transform: rotate(-90deg);
        }

        /* Root object - pink/coral left border */
        .card.root {
            border-left: 4px solid #e91e63;
        }

        .card.root > .card-header {
            background: #fff;
            color: #333;
            border-bottom: 1px solid #eee;
        }

        /* Array items - red/coral header */
        .card.array-item > .card-header {
            background: linear-gradient(135deg, #e57373, #ef5350);
        }

        /* Nested objects in arrays - blue/purple header */
        .card.nested-object > .card-header {
            background: linear-gradient(135deg, #7986cb, #5c6bc0);
        }

        /* Regular nested objects */
        .card.object > .card-header {
            background: linear-gradient(135deg, #4db6ac, #26a69a);
        }

        /* Arrays */
        .card.array > .card-header {
            background: linear-gradient(135deg, #ffb74d, #ffa726);
        }

        .card-body {
            padding: 12px;
        }

        .property {
            display: flex;
            padding: 4px 0;
            font-size: 13px;
            border-bottom: 1px solid #f0f0f0;
        }

        .property:last-child {
            border-bottom: none;
        }

        .property-key {
            color: #666;
            margin-right: 8px;
            font-weight: 500;
        }

        .property-value {
            color: #333;
            word-break: break-all;
        }

        .property-value.string {
            color: #2e7d32;
        }

        .property-value.number {
            color: #1565c0;
        }

        .property-value.boolean {
            color: #7b1fa2;
        }

        .property-value.null {
            color: #757575;
            font-style: italic;
        }

        .property-value.complex {
            color: #888;
            font-style: italic;
            cursor: pointer;
        }

        .property-value.complex:hover {
            color: #555;
        }

        .children-container {
            display: flex;
            flex-direction: column;
            margin-left: 40px;
            padding-left: 20px;
            position: relative;
        }

        .children-container::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 20px;
            width: 2px;
            background: #ddd;
        }

        .child-wrapper {
            position: relative;
            display: flex;
            align-items: flex-start;
        }

        .child-wrapper::before {
            content: '';
            position: absolute;
            left: -20px;
            top: 24px;
            width: 20px;
            height: 2px;
            background: #ddd;
        }

        .tree-row {
            display: flex;
            align-items: flex-start;
        }

        .collapsed .children-container {
            display: none;
        }

        .error-message {
            background: #ffebee;
            border: 1px solid #ef5350;
            border-radius: 8px;
            padding: 20px;
            color: #c62828;
            font-family: monospace;
            white-space: pre-wrap;
        }

        .empty-message {
            color: #888;
            font-style: italic;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div id="diagram" class="diagram-container">
        <div class="empty-message">Loading JSON diagram...</div>
    </div>

    <script>
        (function() {
            const vscode = acquireVsCodeApi();
            const diagramContainer = document.getElementById('diagram');

            // Store collapsed state
            const collapsedNodes = new Set();

            function escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            function getValueType(value) {
                if (value === null) return 'null';
                if (Array.isArray(value)) return 'array';
                return typeof value;
            }

            function formatValue(value) {
                const type = getValueType(value);
                switch (type) {
                    case 'string':
                        return { display: '"' + escapeHtml(value) + '"', class: 'string' };
                    case 'number':
                        return { display: String(value), class: 'number' };
                    case 'boolean':
                        return { display: String(value), class: 'boolean' };
                    case 'null':
                        return { display: 'null', class: 'null' };
                    case 'array':
                        return { display: '[' + value.length + ' items]', class: 'complex' };
                    case 'object':
                        return { display: '{' + Object.keys(value).length + ' keys}', class: 'complex' };
                    default:
                        return { display: String(value), class: '' };
                }
            }

            function isPrimitive(value) {
                return value === null || typeof value !== 'object';
            }

            function renderNode(key, value, path, cardType = 'object', isRoot = false) {
                const nodeId = path.join('.');
                const isCollapsed = collapsedNodes.has(nodeId);
                const type = getValueType(value);
                const isExpandable = type === 'object' || type === 'array';

                let cardClass = cardType;
                if (isRoot) cardClass = 'root';

                let headerText = key;
                if (type === 'array' && !isRoot) {
                    headerText = key;
                } else if (type === 'object' && !isRoot) {
                    headerText = key;
                }

                const html = [];
                html.push('<div class="node ' + (isCollapsed ? 'collapsed' : '') + '">');
                html.push('<div class="card ' + cardClass + '">');

                if (isExpandable || isRoot) {
                    html.push('<div class="card-header" data-node-id="' + escapeHtml(nodeId) + '">');
                    html.push('<span>' + escapeHtml(headerText) + '</span>');
                    html.push('<span class="toggle ' + (isCollapsed ? 'collapsed' : '') + '">▼</span>');
                    html.push('</div>');
                }

                html.push('<div class="card-body">');

                if (type === 'object' && value !== null) {
                    const entries = Object.entries(value);
                    const primitives = entries.filter(([k, v]) => isPrimitive(v));
                    const complex = entries.filter(([k, v]) => !isPrimitive(v));

                    // Render primitive properties
                    for (const [k, v] of primitives) {
                        const formatted = formatValue(v);
                        html.push('<div class="property">');
                        html.push('<span class="property-key">' + escapeHtml(k) + ':</span>');
                        html.push('<span class="property-value ' + formatted.class + '">' + formatted.display + '</span>');
                        html.push('</div>');
                    }

                    // Show complex properties as summaries
                    for (const [k, v] of complex) {
                        const formatted = formatValue(v);
                        html.push('<div class="property">');
                        html.push('<span class="property-key">' + escapeHtml(k) + ':</span>');
                        html.push('<span class="property-value ' + formatted.class + '">' + formatted.display + '</span>');
                        html.push('</div>');
                    }

                    html.push('</div>'); // card-body
                    html.push('</div>'); // card

                    // Render children if not collapsed
                    if (complex.length > 0 && !isCollapsed) {
                        html.push('<div class="children-container">');
                        for (const [k, v] of complex) {
                            const childPath = [...path, k];
                            const childType = Array.isArray(v) ? 'array' : 'nested-object';
                            html.push('<div class="child-wrapper">');
                            html.push(renderNode(k, v, childPath, childType));
                            html.push('</div>');
                        }
                        html.push('</div>');
                    }
                } else if (type === 'array') {
                    // Show array summary
                    html.push('<div class="property">');
                    html.push('<span class="property-value complex">' + value.length + ' items</span>');
                    html.push('</div>');

                    html.push('</div>'); // card-body
                    html.push('</div>'); // card

                    // Render array items if not collapsed
                    if (value.length > 0 && !isCollapsed) {
                        html.push('<div class="children-container">');
                        for (let i = 0; i < value.length; i++) {
                            const item = value[i];
                            const childPath = [...path, i];
                            const itemLabel = key + '[' + i + ']';

                            if (isPrimitive(item)) {
                                const formatted = formatValue(item);
                                html.push('<div class="child-wrapper">');
                                html.push('<div class="node">');
                                html.push('<div class="card array-item">');
                                html.push('<div class="card-header">' + escapeHtml(itemLabel) + '</div>');
                                html.push('<div class="card-body">');
                                html.push('<div class="property">');
                                html.push('<span class="property-value ' + formatted.class + '">' + formatted.display + '</span>');
                                html.push('</div>');
                                html.push('</div></div></div>');
                                html.push('</div>');
                            } else {
                                html.push('<div class="child-wrapper">');
                                html.push(renderNode(itemLabel, item, childPath, 'array-item'));
                                html.push('</div>');
                            }
                        }
                        html.push('</div>');
                    }
                } else {
                    // Primitive at root (unusual but possible)
                    const formatted = formatValue(value);
                    html.push('<div class="property">');
                    html.push('<span class="property-value ' + formatted.class + '">' + formatted.display + '</span>');
                    html.push('</div>');
                    html.push('</div>'); // card-body
                    html.push('</div>'); // card
                }

                html.push('</div>'); // node
                return html.join('');
            }

            function renderDiagram(jsonContent) {
                try {
                    const data = JSON.parse(jsonContent);

                    if (data === null || typeof data !== 'object') {
                        // Handle primitive values at root
                        const formatted = formatValue(data);
                        diagramContainer.innerHTML =
                            '<div class="node"><div class="card root">' +
                            '<div class="card-body"><div class="property">' +
                            '<span class="property-value ' + formatted.class + '">' + formatted.display + '</span>' +
                            '</div></div></div></div>';
                        return;
                    }

                    const rootName = Array.isArray(data) ? 'root[]' : 'root';
                    diagramContainer.innerHTML = renderNode(rootName, data, ['root'], 'root', true);

                    // Add click handlers for expanding/collapsing
                    diagramContainer.querySelectorAll('.card-header[data-node-id]').forEach(header => {
                        header.addEventListener('click', (e) => {
                            const nodeId = header.getAttribute('data-node-id');
                            if (collapsedNodes.has(nodeId)) {
                                collapsedNodes.delete(nodeId);
                            } else {
                                collapsedNodes.add(nodeId);
                            }
                            renderDiagram(jsonContent);
                        });
                    });

                } catch (error) {
                    diagramContainer.innerHTML =
                        '<div class="error-message">Error parsing JSON:\\n\\n' +
                        escapeHtml(error.message) + '</div>';
                }
            }

            // Store the current content for re-renders
            let currentContent = '';

            // Listen for messages from the extension
            window.addEventListener('message', event => {
                const message = event.data;
                if (message.type === 'update') {
                    currentContent = message.content;
                    renderDiagram(currentContent);
                }
            });
        })();
    </script>
</body>
</html>`;
    }
}
