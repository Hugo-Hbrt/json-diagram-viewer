import * as vscode from 'vscode';
import { ReactWebviewContentBuilder } from './ReactWebviewContentBuilder';

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
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'webview-ui', 'dist')
                ]
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
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
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
        return ReactWebviewContentBuilder.buildHtml(this._panel.webview, this._extensionUri);
    }
}
