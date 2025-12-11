import * as vscode from "vscode";
import { JsonDiagramPanel } from "./JsonDiagramPanel";

const JSON_LANGUAGE_ID = "json";
const VIEW_AS_DIAGRAM_COMMAND = "jsonDiagramViewer.viewAsDiagram";

function isJsonDocument(document: vscode.TextDocument): boolean {
  return document.languageId === JSON_LANGUAGE_ID;
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    VIEW_AS_DIAGRAM_COMMAND,
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const document = editor.document;
      if (!isJsonDocument(document)) {
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
      if (isJsonDocument(document)) {
        JsonDiagramPanel.updateIfVisible(document);
      }
    })
  );

  // Watch for document changes (live updates while typing)
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (isJsonDocument(event.document)) {
        JsonDiagramPanel.updateIfVisible(event.document);
      }
    })
  );
}

export function deactivate() {}
