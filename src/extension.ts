import * as vscode from "vscode";
import { JsonDiagramPanel } from "./JsonDiagramPanel";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "jsonDiagramViewer.viewAsDiagram",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const document = editor.document;
      if (document.languageId !== "json") {
        vscode.window.showErrorMessage(
          "This command only works with JSON files"
        );
        return;
      }

      JsonDiagramPanel.createOrShow(context.extensionUri, document);
    }
  );

  context.subscriptions.push(disposable);

  // Watch for document changes to update the diagram
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (document.languageId === "json") {
        JsonDiagramPanel.updateIfVisible(document);
      }
    })
  );

  // Watch for document changes (live updates while typing)
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === "json") {
        JsonDiagramPanel.updateIfVisible(event.document);
      }
    })
  );
}

export function deactivate() {}
