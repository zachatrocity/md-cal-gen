/**
 * Calendar utilities for generating markdown tables
 */

/**
 * Generates a markdown table for a month view calendar
 * @param date A date string in the format YYYY-MM or a Date object
 * @param placeholder Optional text to add alongside the day number
 * @returns A markdown string representing the month calendar
 */
export function generateMonthCalendar(date: string | Date, placeholder: string = ''): string {
    // Parse the date
    const targetDate = typeof date === 'string' ? parseDate(date) : new Date(date);
    
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Get the total number of days in the month
    const daysInMonth = lastDay.getDate();
    
    // Create the header for the markdown table
    const monthName = targetDate.toLocaleString('default', { month: 'long' });
    let calendarTable = `## ${monthName} ${year}\n\n`;
    
    // Add the day headers
    calendarTable += '| Sunday | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday |\n';
    calendarTable += '|--------|--------|---------|-----------|----------|--------|----------|\n';
    
    // Initialize the current day counter
    let currentDay = 1;
    // Initialize the table row
    let tableRow = '|';
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
        tableRow += ' |';
    }
    
    // Fill in the days of the month
    while (currentDay <= daysInMonth) {
        // Get the current day of the week (0-6)
        const dayOfWeek = new Date(year, month, currentDay).getDay();
        
        // If it's a new week (Sunday), start a new row
        if (dayOfWeek === 0 && currentDay !== 1) {
            tableRow += '\n|';
        }
        
        // Add the current day to the table with placeholder
        tableRow += ` ${currentDay}${placeholder} |`;
        
        // Move to the next day
        currentDay++;
        
        // If it's the end of the month and not Saturday, add empty cells to complete the row
        if (currentDay > daysInMonth && dayOfWeek !== 6) {
            for (let i = dayOfWeek + 1; i <= 6; i++) {
                tableRow += ' |';
            }
        }
    }
    
    // Add the table rows to the calendar
    calendarTable += tableRow;
    
    return calendarTable;
}

/**
 * Generates a markdown table for a week view calendar
 * @param date A date string in the format YYYY-MM-DD or a Date object
 * @returns A markdown string representing the week calendar
 */
export function generateWeekCalendar(date: string | Date): string {
    // Parse the date
    const targetDate = typeof date === 'string' ? parseDate(date) : new Date(date);
    
    // Get the day of the week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = targetDate.getDay();
    
    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(targetDate.getDate() - dayOfWeek);
    
    // Create the header for the markdown table
    const weekStart = startOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' });
    const weekEnd = new Date(startOfWeek);
    weekEnd.setDate(startOfWeek.getDate() + 6);
    const weekEndStr = weekEnd.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
    
    let calendarTable = `## Week of ${weekStart} - ${weekEndStr}\n\n`;
    
    // Add the day headers
    calendarTable += '| Day | Date | Notes |\n';
    calendarTable += '|-----|------|-------|\n';
    
    // Add each day of the week
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);
        
        const dayName = currentDate.toLocaleDateString('default', { weekday: 'long' });
        const dateStr = currentDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
        
        calendarTable += `| ${dayName} | ${dateStr} | |\n`;
    }
    
    return calendarTable;
}

/**
 * Parses a date string in various formats and returns a standardized date object
 * @param dateStr Date string in format YYYY-MM or YYYY-MM-DD
 * @returns A Date object
 */
export function parseDate(dateStr: string): Date {
    // Check if the date is in YYYY-MM format
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
        const parts = dateStr.split('-');
        const year = parseInt(parts[0], 10);
        // Convert 1-indexed month (from user input) to 0-indexed month (for JavaScript Date)
        const month = parseInt(parts[1], 10) - 1;
        return new Date(year, month, 1);
    }
    
    // Check if the date is in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const parts = dateStr.split('-');
        const year = parseInt(parts[0], 10);
        // Convert 1-indexed month (from user input) to 0-indexed month (for JavaScript Date)
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
    
    throw new Error('Invalid date format. Please use YYYY-MM or YYYY-MM-DD format.');
}
