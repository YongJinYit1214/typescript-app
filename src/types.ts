export type EventCategory = 'work' | 'personal' | 'family' | 'health' | 'other';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number; // Every X days/weeks/months/years
  endDate?: Date; // Optional end date for the recurrence
  count?: number; // Optional number of occurrences
}

export interface CategoryInfo {
  label: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: Record<EventCategory, CategoryInfo> = {
  work: { label: 'Work', color: '#3949ab', bgColor: '#e8eaf6' },
  personal: { label: 'Personal', color: '#00897b', bgColor: '#e0f2f1' },
  family: { label: 'Family', color: '#7b1fa2', bgColor: '#f3e5f5' },
  health: { label: 'Health', color: '#d81b60', bgColor: '#fce4ec' },
  other: { label: 'Other', color: '#5d4037', bgColor: '#efebe9' }
};

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  description?: string;
  important: boolean;
  category: EventCategory;
  recurrence?: RecurrenceRule;
  reminderMinutes?: number[]; // Minutes before event to show reminders
  isRecurrenceInstance?: boolean; // Whether this is an instance of a recurring event
  parentEventId?: string; // ID of the parent recurring event if this is an instance
}
