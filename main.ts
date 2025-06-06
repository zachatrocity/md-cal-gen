import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { generateMonthCalendar, generateWeekCalendar, parseDate } from './calendar-utils';

interface CalendarSettings {
	defaultView: 'month' | 'week';
	defaultFormat: string;
}

const DEFAULT_SETTINGS: CalendarSettings = {
	defaultView: 'month',
	defaultFormat: 'YYYY-MM-DD'
}

export default class MarkdownCalendarPlugin extends Plugin {
	settings: CalendarSettings;

	async onload() {
		await this.loadSettings();

		// Add command to insert month calendar
		this.addCommand({
			id: 'insert-month-calendar',
			name: 'Insert month calendar',
			editorCallback: (editor: Editor) => {
				new MonthCalendarModal(this.app, editor).open();
			}
		});

		// Add command to insert week calendar
		this.addCommand({
			id: 'insert-week-calendar',
			name: 'Insert week calendar',
			editorCallback: (editor: Editor) => {
				new WeekCalendarModal(this.app, editor).open();
			}
		});

		// Add command to insert calendar with current date
		this.addCommand({
			id: 'insert-current-calendar',
			name: 'Insert calendar for current date',
			editorCallback: (editor: Editor) => {
				const today = new Date();
				const year = today.getFullYear();
				const month = today.getMonth() + 1; // Convert 0-indexed to 1-indexed month
				const day = today.getDate();
				
				// Format with leading zeros
				const formattedMonth = String(month).padStart(2, '0');
				const formattedDay = String(day).padStart(2, '0');
				const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
				
				if (this.settings.defaultView === 'month') {
					const monthStr = `${year}-${formattedMonth}`; // YYYY-MM
					// Use empty placeholder for quick insert
					const calendar = generateMonthCalendar(monthStr, '');
					editor.replaceSelection(calendar);
				} else {
					const calendar = generateWeekCalendar(formattedDate);
					editor.replaceSelection(calendar);
				}
				
				new Notice(`Inserted ${this.settings.defaultView} calendar`);
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new CalendarSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class MonthCalendarModal extends Modal {
	private editor: Editor;

	constructor(app: App, editor: Editor) {
		super(app);
		this.editor = editor;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.createEl('h2', {text: 'Insert Month Calendar'});

		// Create date input
		const dateInputSetting = new Setting(contentEl)
			.setName('Month')
			.setDesc('Enter month in format YYYY-MM (e.g., 2025-11)');
		
		const dateInput = dateInputSetting.controlEl.createEl('input', {
			attr: {
				type: 'text',
				placeholder: 'YYYY-MM (e.g., 2025-11)'
			}
		});

		// Get current month as default
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		dateInput.value = `${year}-${month}`;

		// Create placeholder input
		const placeholderInputSetting = new Setting(contentEl)
			.setName('Day Placeholder')
			.setDesc('Optional text to add alongside the day number (e.g., " 📝" will show "1 📝")');
		
		const placeholderInput = placeholderInputSetting.controlEl.createEl('input', {
			attr: {
				type: 'text',
				placeholder: 'e.g., " 📝" or " []"'
			}
		});

		// Create button to insert calendar
		new Setting(contentEl)
			.addButton(button => {
				button
					.setButtonText('Insert Month Calendar')
					.setCta()
					.onClick(() => {
						try {
							const calendar = generateMonthCalendar(dateInput.value, placeholderInput.value);
							this.editor.replaceSelection(calendar);
							this.close();
							new Notice('Inserted month calendar');
						} catch (error) {
							new Notice(`Error: ${error.message}`);
						}
					});
			});
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class WeekCalendarModal extends Modal {
	private editor: Editor;

	constructor(app: App, editor: Editor) {
		super(app);
		this.editor = editor;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.createEl('h2', {text: 'Insert Week Calendar'});

		// Create date input
		const dateInputSetting = new Setting(contentEl)
			.setName('Date')
			.setDesc('Enter any date in the week in format YYYY-MM-DD (e.g., 2025-11-03)');
		
		const dateInput = dateInputSetting.controlEl.createEl('input', {
			attr: {
				type: 'text',
				placeholder: 'YYYY-MM-DD (e.g., 2025-11-03)'
			}
		});

		// Get today's date as default
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const day = String(today.getDate()).padStart(2, '0');
		dateInput.value = `${year}-${month}-${day}`;

		// Create button to insert calendar
		new Setting(contentEl)
			.addButton(button => {
				button
					.setButtonText('Insert Week Calendar')
					.setCta()
					.onClick(() => {
						try {
							const calendar = generateWeekCalendar(dateInput.value);
							this.editor.replaceSelection(calendar);
							this.close();
							new Notice('Inserted week calendar');
						} catch (error) {
							new Notice(`Error: ${error.message}`);
						}
					});
			});
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class CalendarSettingTab extends PluginSettingTab {
	plugin: MarkdownCalendarPlugin;

	constructor(app: App, plugin: MarkdownCalendarPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h2', {text: 'Markdown Calendar Generator Settings'});

		new Setting(containerEl)
			.setName('Default View')
			.setDesc('Choose the default calendar view type')
			.addDropdown(dropdown => dropdown
				.addOption('month', 'Month View')
				.addOption('week', 'Week View')
				.setValue(this.plugin.settings.defaultView)
				.onChange(async (value: 'month' | 'week') => {
					this.plugin.settings.defaultView = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Date Format')
			.setDesc('The format used for displaying dates (currently only supports YYYY-MM-DD)')
			.addText(text => text
				.setPlaceholder('YYYY-MM-DD')
				.setValue(this.plugin.settings.defaultFormat)
				.setDisabled(true) // Disabled for now as we only support one format
				.onChange(async (value) => {
					this.plugin.settings.defaultFormat = value;
					await this.plugin.saveSettings();
				}));
	}
}
