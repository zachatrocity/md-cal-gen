<div align="center">

```
    ▌      ▜         
▛▛▌▛▌▄▖▛▘▀▌▐ ▄▖▛▌█▌▛▌
▌▌▌▙▌  ▙▖█▌▐▖  ▙▌▙▖▌▌
               ▄▌    
```

[![Add to Obsidian](https://img.shields.io/badge/Add%20to-Obsidian-7963E5?style=for-the-badge&logo=obsidian)](https://obsidian.md/plugins?id=md-cal-gen)

An intentionally simple Obsidian plugin that generates markdown-based table calendars. This plugin allows you to quickly insert formatted calendar tables in your notes that look like this...

</div>

## November 2025

| Sunday | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday |
| ------ | ------ | ------- | --------- | -------- | ------ | -------- |
|        |        |         |           |          |        | 1 🟢     |
| 2 🟢   | 3 🟢   | 4 🟢    | 5 🟢      | 6 🟢     | 7 🟢   | 8 🟢     |
| 9 🟢   | 10 🟢  | 11 🟢   | 12 🟢     | 13 🟢    | 14 🟢  | 15 🟢    |
| 16 🟢  | 17 🟢  | 18 🟢   | 19 🟢     | 20 🟢    | 21 🟢  | 22 🟢    |
| 23 🟢  | 24 🟢  | 25 🟢   | 26 🟢     | 27 🟢    | 28 🟢  | 29 🟢    |
| 30 🟢  |        |         |           |          |        |          |


or this...

## Week of Nov 2 - Nov 8, 2025

| Day | Date | Notes |
|-----|------|-------|
| Sunday | Nov 2 | |
| Monday | Nov 3 | |
| Tuesday | Nov 4 | |
| Wednesday | Nov 5 | |
| Thursday | Nov 6 | |
| Friday | Nov 7 | |
| Saturday | Nov 8 | |


## Features

- Generate month view calendars (e.g., November 2025)
- Generate week view calendars (e.g., week of Nov 3 - Nov 9, 2025)
- Support for mobile and desktop
- Simple and intuitive interface
- Customizable settings

## How to Use

### Month View Calendar

1. Open a note where you want to insert a calendar
2. Use the command palette (Ctrl/Cmd+P) and search for "Insert month calendar"
3. Enter the month in YYYY-MM format (e.g., 2025-11 for November 2025)
4. Click "Insert Month Calendar"

### Week View Calendar

1. Open a note where you want to insert a calendar
2. Use the command palette (Ctrl/Cmd+P) and search for "Insert week calendar"
3. Enter any date in the week in YYYY-MM-DD format (e.g., 2025-11-03)
4. Click "Insert Week Calendar"


### Quick Insert Current Calendar

You can also quickly insert a calendar for the current date using the "Insert calendar for current date" command. This will use your default view setting (month or week).

## Installation

### From Obsidian Community Plugins

1. Open Obsidian Settings
2. Go to Community Plugins and disable Safe Mode
3. Click Browse and search for "Markdown Calendar Generator"
4. Install the plugin and enable it

### Manual Installation

1. Download the latest release from the [GitHub releases page](https://github.com/zachatrocity/md-cal-gen/releases)
2. Extract the zip file to your Obsidian vault's `.obsidian/plugins/` directory
3. Enable the plugin in Obsidian's Community Plugins settings

## Settings

The plugin offers the following settings:

- **Default View**: Choose between month or week view as your default calendar type
- **Date Format**: Currently only supports YYYY-MM-DD format (this setting is for future expansion)

## Development

This plugin is built using the Obsidian Plugin API and TypeScript.

### Building the plugin

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the compilation in watch mode

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have feature requests, please [open an issue](https://github.com/zachatrocity/md-cal-gen/issues) on the GitHub repository.
