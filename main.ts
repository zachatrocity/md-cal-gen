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

		// Add command to open the general calendar modal
		this.addCommand({
			id: 'insert-calendar',
			name: 'Insert calendar',
			editorCallback: (editor: Editor) => {
				new CalendarModal(this.app, editor, this.settings).open();
			}
		});

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
					const calendar = generateMonthCalendar(monthStr);
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

class CalendarModal extends Modal {
	private editor: Editor;
	private settings: CalendarSettings;

	constructor(app: App, editor: Editor, settings: CalendarSettings) {
		super(app);
		this.editor = editor;
		this.settings = settings;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.createEl('h2', {text: 'Insert Calendar'});

		// Create view type selection
		new Setting(contentEl)
			.setName('Calendar View')
			.setDesc('Choose between month or week view')
			.addDropdown(dropdown => {
				dropdown
					.addOption('month', 'Month View')
					.addOption('week', 'Week View')
					.setValue(this.settings.defaultView)
					.onChange(value => {
						const dateInput = contentEl.querySelector('.calendar-date-input') as HTMLInputElement;
						if (value === 'month') {
							dateInput.placeholder = 'YYYY-MM (e.g., 2025-11)';
						} else {
							dateInput.placeholder = 'YYYY-MM-DD (e.g., 2025-11-03)';
						}
					});
			});

		// Create date input
		const dateInputSetting = new Setting(contentEl)
			.setName('Date')
			.setDesc('Enter date in format YYYY-MM for month view or YYYY-MM-DD for week view');
		
		const dateInput = dateInputSetting.controlEl.createEl('input', {
			attr: {
				type: 'text',
				placeholder: this.settings.defaultView === 'month' 
					? 'YYYY-MM (e.g., 2025-11)' 
					: 'YYYY-MM-DD (e.g., 2025-11-03)',
				class: 'calendar-date-input'
			}
		});

		// Get today's date as default
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const day = String(today.getDate()).padStart(2, '0');
		
		if (this.settings.defaultView === 'month') {
			dateInput.value = `${year}-${month}`;
		} else {
			dateInput.value = `${year}-${month}-${day}`;
		}

		// Create button to insert calendar
		new Setting(contentEl)
			.addButton(button => {
				button
					.setButtonText('Insert Calendar')
					.setCta()
					.onClick(() => {
						const viewType = (contentEl.querySelector('.setting-item:first-child select') as HTMLSelectElement).value as 'month' | 'week';
						const dateValue = dateInput.value;
						
						try {
							let calendar: string;
							
							if (viewType === 'month') {
								calendar = generateMonthCalendar(dateValue);
							} else {
								calendar = generateWeekCalendar(dateValue);
							}
							
							this.editor.replaceSelection(calendar);
							this.close();
							new Notice(`Inserted ${viewType} calendar`);
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

		// Create button to insert calendar
		new Setting(contentEl)
			.addButton(button => {
				button
					.setButtonText('Insert Month Calendar')
					.setCta()
					.onClick(() => {
						try {
							const calendar = generateMonthCalendar(dateInput.value);
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
