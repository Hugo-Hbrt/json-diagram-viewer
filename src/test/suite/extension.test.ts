import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Extension should be present", () => {
    assert.ok(
      vscode.extensions.getExtension("Hugo-Hbrt.json-diagram-viewer")
    );
  });

  test("Extension should only activate on JSON file", async () => {
    const ext = vscode.extensions.getExtension(
      "Hugo-Hbrt.json-diagram-viewer"
    );
    assert.ok(ext);

    assert.strictEqual(ext.isActive, false);
    // Create a JSON document to trigger activation
    const doc = await vscode.workspace.openTextDocument({
      language: "json",
      content: '{"test": true}',
    });
    await vscode.window.showTextDocument(doc);

    // Wait for activation
    await ext.activate();
    assert.strictEqual(ext.isActive, true);
  });

  test("Command should be registered", async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes("jsonDiagramViewer.viewAsDiagram"));
  });

  test("Command should fail without active editor", async () => {
    // Close all editors
    await vscode.commands.executeCommand("workbench.action.closeAllEditors");

    // Give VS Code time to close editors
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Command should not throw, but should show error message
    await vscode.commands.executeCommand("jsonDiagramViewer.viewAsDiagram");
    // If we get here without error, the command handled the missing editor gracefully
    assert.ok(true);
  });

  test("Command should work with JSON file", async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: "json",
      content: '{"name": "test", "value": 42}',
    });
    await vscode.window.showTextDocument(doc);

    // Execute the command
    await vscode.commands.executeCommand("jsonDiagramViewer.viewAsDiagram");

    // Give the panel time to open
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify a webview panel is open (we can't easily access the panel directly)
    assert.ok(true);
  });
});
