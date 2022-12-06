import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import {ISettings, Settings} from "./src/settings";

export default class MyPlugin extends Plugin {
	settings: ISettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

	}

	onunload() {

	}


	async loadSettings() {
		this.settings = Object.assign({}, Settings, await this.loadData());
	}

	async writeOptions(changeOpts: (settings: ISettings) => void): Promise<void> {
		await this.saveData(changeOpts);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SettingsTab extends PluginSettingTab {
	
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});




				


		new Setting(containerEl)
			.setName('Display cookware')
			.setDesc('Whether cookware should be displayed in a recipe')
			.addToggle(t => {
				t.setValue(this.plugin.settings.displayCookware)
				t.onChange(async(value)=>{
					await this.plugin.writeOptions(old => (old.displayCookware = value));
				});
			});

		new Setting(containerEl)
			.setName('Display ingredients')
			.setDesc('Whether ingredients should be displayed in a recipe')
			.addToggle(t => {
				t.setValue(this.plugin.settings.displayIngredients)
				t.onChange(async(value)=>{
					await this.plugin.writeOptions(old => (old.displayIngredients = value));
				});
			});

		new Setting(containerEl)
			.setName('Display total cook time')
			.setDesc('Whether the total cook time should be displayed in a recipe')
			.addToggle(t => {
				t.setValue(this.plugin.settings.displayTotalCookTime)
				t.onChange(async(value)=>{
					await this.plugin.writeOptions(old => (old.displayTotalCookTime = value));
				});
			});

		new Setting(containerEl)
			.setName('Display quantities inline')
			.setDesc('Whether the quantities should be displayed alongside the recipe instruction')
			.addToggle(t => {
				t.setValue(this.plugin.settings.displayQuantityInline)
				t.onChange(async(value)=>{
					await this.plugin.writeOptions(old => (old.displayQuantityInline = value));
				});
			});
	}
}