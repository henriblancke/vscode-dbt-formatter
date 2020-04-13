import * as vscode from "vscode";
import dbtFormatter from "dbt-formatter";

interface FormatterOptions {
  sql: string;
  indent: number;
  upper: boolean;
  newline: boolean;
  lowerWords: boolean;
  allowCamelcase: boolean;
}

const getDocumentRange = (document: vscode.TextDocument): vscode.Range => {
  const lastLineId = document.lineCount - 1;
  return new vscode.Range(
    0,
    0,
    lastLineId,
    document.lineAt(lastLineId).text.length
  );
};

const newLineConfig = (options: vscode.FormattingOptions): boolean => {
  if (options.insertFinalNewline === undefined) {
    if (options.trimFinalNewlines === undefined) {
      return true;
    }

    return !options.trimFinalNewlines;
  }

  return options.insertFinalNewline === true;
};

const getConfig = (options: vscode.FormattingOptions): FormatterOptions => ({
  lowerWords: vscode.workspace
    .getConfiguration("dbt-formatter")
    .get("lowerWords", true),
  upper: vscode.workspace.getConfiguration("dbt-formatter").get("upper", true),
  allowCamelcase: vscode.workspace
    .getConfiguration("dbt-formatter")
    .get("camelCase", true),
  sql: vscode.workspace
    .getConfiguration("dbt-formatter")
    .get("dialect", "default"),
  indent: options.tabSize,
  newline: newLineConfig(options),
});

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.languages.registerDocumentFormattingEditProvider(
    [{ language: "sql" }, { language: "jinja-sql" }],
    { provideDocumentFormattingEdits }
  );
  context.subscriptions.push(disposable);
}

export async function provideDocumentFormattingEdits(
  document: vscode.TextDocument,
  options: vscode.FormattingOptions,
  token: vscode.CancellationToken
): Promise<vscode.TextEdit[]> {
  const edits: vscode.TextEdit[] = [];

  if (document.lineCount >= 1) {
    let firstLine = document.lineAt(0);

    // check for ignore text
    if (firstLine.text.indexOf("dbt-formatter-ignore") === -1) {
      const text = document.getText();
      const formatted = dbtFormatter(text, getConfig(options));
      if (formatted && formatted.length > 0) {
        const replacement = vscode.TextEdit.replace(
          getDocumentRange(document),
          formatted
        );
        edits.push(replacement);
      }
    }
  }

  return edits;
}

// this method is called when your extension is deactivated
export function deactivate() {}
