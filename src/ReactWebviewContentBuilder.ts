import * as vscode from 'vscode';

export class ReactWebviewContentBuilder {
    public static buildHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
        const webviewDistPath = vscode.Uri.joinPath(extensionUri, 'webview-ui', 'dist');

        // Get URIs for the React bundle files
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(webviewDistPath, 'webview.js')
        );
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(webviewDistPath, 'webview.css')
        );

        // Use a nonce to only allow specific scripts to run
        const nonce = getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <link href="${styleUri}" rel="stylesheet">
    <title>JSON Diagram</title>
</head>
<body>
    <div id="root"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
    }
}

function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
