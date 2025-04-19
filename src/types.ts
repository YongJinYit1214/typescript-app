export type EventCategory = 'work' | 'personal' | 'family' | 'health' | 'other';

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
}
