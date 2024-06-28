import * as vscode from 'vscode';
import { HellowWorldPanel } from './HellowWorldPanel';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "vstode" is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('vstode.helloWorld', () => {

		const editor = vscode.window.activeTextEditor;

        if (editor) {

			const extensionPath = context.extensionUri.fsPath;

			const buildDir = path.join(extensionPath, 'build');
			const sourceFilePath = path.join(buildDir, 'temp.c');
			const executablePath = path.join(buildDir, 'temp.exe');
			const serverDir = path.join(extensionPath, 'server'); 

			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('No active editor found.');
				return;
			}
			const sourceCode = editor.document.getText();

			if (!fs.existsSync(buildDir)) {
				fs.mkdirSync(buildDir, { recursive: true });
			}

			fs.writeFileSync(sourceFilePath, sourceCode);

			exec(`gcc "${sourceFilePath}" -g -o "${executablePath}"`, (error, stdout, stderr) => {
				if (error) {
					console.log('Compilation failed: ' + stderr);
					return;
				}
				console.log('Compilation succeeded, executable created at: ' + executablePath);
			
				exec(`node uploadcodes.mjs`, { cwd: serverDir }, (error, stdout, stderr) => {
					if (error) {
						console.log('Error running uploadcodes.mjs: ' + stderr);
						return;
					}
					console.log('uploadcodes.mjs executed successfully: ' + stdout);
				});
			});

			

        } else {

            vscode.window.showInformationMessage('No active editor');
			
        };

		HellowWorldPanel.createOrShow(context.extensionUri);

	}));

}

export function deactivate() {}
