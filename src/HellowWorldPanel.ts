import * as vscode from "vscode";

export class HellowWorldPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: HellowWorldPanel | undefined;

  public static readonly viewType = "hello-world";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (HellowWorldPanel.currentPanel) {
      HellowWorldPanel.currentPanel._panel.reveal(column);
      HellowWorldPanel.currentPanel._update();
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      HellowWorldPanel.viewType,
      "VSinder",
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` and `dist` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out/compiled"),
          vscode.Uri.joinPath(extensionUri, "dist"),
        ],
      }
    );

    HellowWorldPanel.currentPanel = new HellowWorldPanel(panel, extensionUri);
  }

  public static kill() {
    HellowWorldPanel.currentPanel?.dispose();
    HellowWorldPanel.currentPanel = undefined;
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    HellowWorldPanel.currentPanel = new HellowWorldPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // // Handle messages from the webview
    // this._panel.webview.onDidReceiveMessage(
    //   (message) => {
    //     switch (message.command) {
    //       case "alert":
    //         vscode.window.showErrorMessage(message.text);
    //         return;
    //     }
    //   },
    //   null,
    //   this._disposables
    // );
  }

  public dispose() {
    HellowWorldPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update() {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(webview);
    webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        // case "tokens": {
        //   await Util.globalState.update(accessTokenKey, data.accessToken);
        //   await Util.globalState.update(refreshTokenKey, data.refreshToken);
        //   break;
        // }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "render.mjs"));

    //Get p5.js library loaded
    const p5Uri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "p5.mjs"));

    // Local path to css styles
    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri,"media","reset.css"));
    const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri,"media","vscode.css"));

    return `<!DOCTYPE html>
		<html lang="en">
		<head>
	    <meta charset="UTF-8">
      <script src="${p5Uri}"></script>
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${stylesResetUri}" rel="stylesheet">
      <link href="${stylesMainUri}" rel="stylesheet">
		</head>
    <body>
      
      <pre id="codeBlock"></pre>
      <div class="slider-container">
        <div class="controls-container">
            <div class="slider-display">
              <span id="sliderValue">0</span>
              <input type="range" id="arraySlider" min="0" value="0" disabled>
            </div>
            <div class="button-container">
                <button id="revStepIn">revStepIn</button>
                <button id="StepIn">StepIn</button>
                <button id="revNext">revNext</button>
                <button id="Next">Next</button>
            </div>
        </div>
        <div class="animation-container">
          <div id="animation-container1" class="animation-container" ></div>
          <div id="animation-container2" class="animation-container" ></div>
          <div id="animation-container3" class="animation-container" ></div>
          <div id="animation-container4" class="animation-container" ></div>
          <div id="animation-container6" class="animation-container" ></div>
        </div>
      </div>
      
      <script type="module" src="${scriptUri}"></script>

		</body>
           
		</html>`;
  }
}