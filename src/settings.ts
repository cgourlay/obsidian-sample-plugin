import { App, PluginSettingTab, Setting } from 'obsidian';
import CooklangPlugin from 'main';

export interface ISettings {
	displayCookware: boolean;
	displayIngredients: boolean;
	displayTotalCookTime: boolean;
    displayQuantityInline: boolean;
}

export const Settings : ISettings = {
	displayCookware: true,
	displayIngredients: true,
	displayTotalCookTime: true,
    displayQuantityInline: true
}

export class SettingsTab extends PluginSettingTab {
	
	private plugin: CooklangPlugin;

	constructor(app: App, plugin: CooklangPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		
        let { containerEl } = this;

		containerEl.empty();

        this.cookwareSettings();
        this.ingredientSettings();
        this.cookTimeSettings();
        this.inlineQuantitySettings();
	}

    cookTimeSettings(){
        new Setting(this.containerEl)
        .setName('Display total cook time')
        .setDesc('Whether the total cook time should be displayed in a recipe')
        .addToggle(t => {
            t.setValue(this.plugin.settings.displayTotalCookTime)
            t.onChange(async(value)=>{
                await this.plugin.writeOptions(old => (old.displayTotalCookTime = value));
            });
        });
    }

    cookwareSettings(){
        new Setting(this.containerEl)
        .setName('Display cookware')
        .setDesc('Whether cookware should be displayed in a recipe')
        .addToggle(t => {
            t.setValue(this.plugin.settings.displayCookware)
            t.onChange(async(value)=>{
                await this.plugin.writeOptions(old => (old.displayCookware = value));
            });
        });
    }

    ingredientSettings(){
        new Setting(this.containerEl)
        .setName('Display ingredients')
        .setDesc('Whether ingredients should be displayed in a recipe')
        .addToggle(t => {
            t.setValue(this.plugin.settings.displayIngredients)
            t.onChange(async(value)=>{
                await this.plugin.writeOptions(old => (old.displayIngredients = value));
            });
        });
    }

    inlineQuantitySettings(){
        new Setting(this.containerEl)
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